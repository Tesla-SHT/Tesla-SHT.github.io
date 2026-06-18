const { execFileSync } = require('child_process');
const path = require('path');
const moment = require('moment');

const gitDateCache = new Map();

function asMoment(value) {
  if (!value) return null;
  const parsed = moment(value);
  return parsed.isValid() ? parsed : null;
}

function latestGitDate(source) {
  if (!source) return null;
  if (gitDateCache.has(source)) return gitDateCache.get(source);

  const filePath = path.isAbsolute(source) ? source : path.join(hexo.base_dir, source);

  try {
    const output = execFileSync('git', ['log', '-1', '--format=%aI', '--', filePath], {
      cwd: hexo.base_dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    const parsed = asMoment(output);
    gitDateCache.set(source, parsed);
    return parsed;
  } catch (error) {
    gitDateCache.set(source, null);
    return null;
  }
}

hexo.extend.filter.register('before_post_render', function(data) {
  const candidates = [
    asMoment(data.updated),
    latestGitDate(data.source),
    asMoment(data.date)
  ].filter(Boolean);

  data.updated = candidates.reduce(function(latest, current) {
    return current.valueOf() > latest.valueOf() ? current : latest;
  }, candidates[0] || moment());

  return data;
});
