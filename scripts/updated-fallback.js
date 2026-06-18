const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const moment = require('moment');

const cache = new Map();

function asMoment(value) {
  if (!value) return null;
  const parsed = moment(value);
  return parsed.isValid() ? parsed : null;
}

function git(args) {
  return execFileSync('git', args, {
    cwd: hexo.base_dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  }).trimEnd();
}

function gitMaybe(args) {
  try {
    return git(args);
  } catch (error) {
    return null;
  }
}

function resolvePostPath(data) {
  const candidates = [];
  const sourceDir = hexo.config.source_dir || 'source';

  if (data.full_source) candidates.push(data.full_source);
  if (data.source) {
    candidates.push(data.source);
    candidates.push(path.join(sourceDir, data.source));
  }

  for (const candidate of candidates) {
    const absolute = path.isAbsolute(candidate)
      ? candidate
      : path.join(hexo.base_dir, candidate);
    if (fs.existsSync(absolute)) {
      return {
        absolute,
        relative: path.relative(hexo.base_dir, absolute).split(path.sep).join('/')
      };
    }
  }

  return null;
}

function normalizePost(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return normalized.trim();

  return match[2].trim();
}

function frontMatterUpdated(data) {
  const resolved = resolvePostPath(data);
  if (!resolved) return null;

  const raw = fs.readFileSync(resolved.absolute, 'utf8').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;

  const frontMatter = yaml.load(match[1], { schema: yaml.FAILSAFE_SCHEMA }) || {};
  return asMoment(frontMatter.updated);
}

function blobAt(ref, relativePath) {
  return gitMaybe(['show', `${ref}:${relativePath}`]);
}

function commitTime(hash) {
  return asMoment(gitMaybe(['show', '-s', '--format=%aI', hash]));
}

function latestContentUpdate(data) {
  const resolved = resolvePostPath(data);
  if (!resolved) return null;

  if (cache.has(resolved.relative)) return cache.get(resolved.relative);

  const currentRaw = fs.readFileSync(resolved.absolute, 'utf8');
  const currentNormalized = normalizePost(currentRaw);
  const headRaw = blobAt('HEAD', resolved.relative);

  if (!headRaw) {
    const created = asMoment(data.date) || moment();
    cache.set(resolved.relative, created);
    return created;
  }

  if (normalizePost(headRaw) !== currentNormalized) {
    const now = moment();
    cache.set(resolved.relative, now);
    return now;
  }

  const commits = gitMaybe(['log', '--format=%H', '--', resolved.relative]);
  if (!commits) {
    cache.set(resolved.relative, null);
    return null;
  }

  for (const hash of commits.split('\n').filter(Boolean)) {
    const rawAtCommit = blobAt(hash, resolved.relative);
    const rawAtParent = blobAt(`${hash}^`, resolved.relative);
    if (!rawAtCommit) continue;

    if (!rawAtParent || normalizePost(rawAtCommit) !== normalizePost(rawAtParent)) {
      const updated = commitTime(hash);
      cache.set(resolved.relative, updated);
      return updated;
    }
  }

  cache.set(resolved.relative, null);
  return null;
}

hexo.extend.filter.register('before_post_render', function(data) {
  const candidates = [
    frontMatterUpdated(data),
    latestContentUpdate(data),
    asMoment(data.date)
  ].filter(Boolean);

  data.updated = candidates.reduce(function(latest, current) {
    return current.valueOf() > latest.valueOf() ? current : latest;
  }, candidates[0] || moment());

  return data;
});
