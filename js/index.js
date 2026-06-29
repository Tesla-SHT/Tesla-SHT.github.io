// 内容自动上升
function contentMove(){
    const contentDom = document.getElementById('content');
    if (!contentDom) {
        return;
    }
    contentDom.classList.add('content-move');
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const storageKey = 'quiet-theme';

    if (!themeToggle) {
        return;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        themeToggle.setAttribute('aria-label', theme === 'dark' ? '切换浅色模式' : '切换暗黑模式');
        themeToggle.setAttribute('title', theme === 'dark' ? '切换浅色模式' : '切换暗黑模式');
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    themeToggle.addEventListener('click', function () {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        try {
            localStorage.setItem(storageKey, nextTheme);
        } catch (error) {}
    });
}

function initSiteSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchPanel = document.getElementById('search-panel');
    const searchInput = document.getElementById('search-panel-input');
    const searchResults = document.getElementById('search-panel-results');
    const searchStatus = document.getElementById('search-panel-status');

    if (!searchToggle || !searchPanel || !searchInput || !searchResults || !searchStatus) {
        return;
    }

    const indexUrl = searchToggle.getAttribute('data-search-index') || '/search.json';
    let searchIndex = [];
    let searchIndexPromise = null;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function tokenize(value) {
        return String(value || '')
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean);
    }

    function highlight(value, terms) {
        if (!terms.length) {
            return escapeHtml(value);
        }

        const pattern = terms.map(escapeRegExp).join('|');
        const matcher = new RegExp(`(${pattern})`, 'ig');
        const termSet = new Set(terms);

        return String(value || '')
            .split(matcher)
            .map(function(part) {
                return termSet.has(part.toLowerCase())
                    ? `<mark>${escapeHtml(part)}</mark>`
                    : escapeHtml(part);
            })
            .join('');
    }

    function loadSearchIndex() {
        if (!searchIndexPromise) {
            searchStatus.textContent = 'Loading...';
            searchIndexPromise = fetch(indexUrl, { cache: 'force-cache' })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Search index request failed');
                    }
                    return response.json();
                })
                .then(function(data) {
                    searchIndex = Array.isArray(data) ? data : [];
                    return searchIndex;
                })
                .catch(function() {
                    searchStatus.textContent = 'Search index failed to load.';
                    searchIndex = [];
                    return searchIndex;
                });
        }

        return searchIndexPromise;
    }

    function snippetFor(item, terms) {
        const source = item.content || item.excerpt || '';
        const lowerSource = source.toLowerCase();
        let firstIndex = -1;

        terms.forEach(function(term) {
            const index = lowerSource.indexOf(term);
            if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
                firstIndex = index;
            }
        });

        if (firstIndex === -1) {
            return item.excerpt || source.slice(0, 180);
        }

        const start = Math.max(0, firstIndex - 70);
        const end = Math.min(source.length, start + 190);
        return `${start > 0 ? '...' : ''}${source.slice(start, end)}${end < source.length ? '...' : ''}`;
    }

    function searchPosts(query) {
        const terms = tokenize(query);
        if (!terms.length) {
            return [];
        }

        return searchIndex
            .map(function(item) {
                const title = String(item.title || '').toLowerCase();
                const meta = `${(item.tags || []).join(' ')} ${(item.categories || []).join(' ')}`.toLowerCase();
                const excerpt = String(item.excerpt || '').toLowerCase();
                const content = String(item.content || '').toLowerCase();
                const searchText = `${title} ${meta} ${excerpt} ${content}`;

                if (!terms.every(function(term) { return searchText.indexOf(term) !== -1; })) {
                    return null;
                }

                const score = terms.reduce(function(total, term) {
                    if (title.indexOf(term) !== -1) total += 12;
                    if (meta.indexOf(term) !== -1) total += 7;
                    if (excerpt.indexOf(term) !== -1) total += 4;
                    if (content.indexOf(term) !== -1) total += 1;
                    return total;
                }, 0);

                return { item, score };
            })
            .filter(Boolean)
            .sort(function(a, b) {
                return b.score - a.score;
            })
            .slice(0, 12);
    }

    function renderResults(query) {
        const terms = tokenize(query);
        const matches = searchPosts(query);

        if (!terms.length) {
            searchStatus.textContent = '';
            searchResults.innerHTML = '';
            return;
        }

        if (!matches.length) {
            searchStatus.textContent = 'No matching posts.';
            searchResults.innerHTML = '';
            return;
        }

        searchStatus.textContent = `${matches.length} result${matches.length > 1 ? 's' : ''}`;
        searchResults.innerHTML = matches.map(function(match) {
            const item = match.item;
            const meta = [item.date, (item.tags || []).slice(0, 3).join(', ')].filter(Boolean).join(' · ');
            const snippet = snippetFor(item, terms);

            return `
                <article class="search-result-item">
                    <a href="${escapeHtml(item.url)}">
                        <h3>${highlight(item.title, terms)}</h3>
                        ${meta ? `<div class="search-result-meta">${escapeHtml(meta)}</div>` : ''}
                        <p>${highlight(snippet, terms)}</p>
                    </a>
                </article>
            `;
        }).join('');
    }

    function openSearchPanel() {
        searchPanel.setAttribute('aria-hidden', 'false');
        document.body.classList.add('search-open');
        loadSearchIndex().then(function() {
            renderResults(searchInput.value);
        });
        setTimeout(function() {
            searchInput.focus();
        }, 0);
    }

    function closeSearchPanel() {
        searchPanel.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('search-open');
        searchToggle.focus();
    }

    searchToggle.addEventListener('click', openSearchPanel);
    searchInput.addEventListener('input', function() {
        loadSearchIndex().then(function() {
            renderResults(searchInput.value);
        });
    });

    searchPanel.querySelectorAll('[data-search-close]').forEach(function(closeButton) {
        closeButton.addEventListener('click', closeSearchPanel);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && searchPanel.getAttribute('aria-hidden') === 'false') {
            closeSearchPanel();
        }
    });
}

// header 滚动动画
window.onscroll = function() {
    //为了保证兼容性，这里取两个值，哪个有值取哪一个
    //scrollTop就是触发滚轮事件时滚轮的高度
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const headerTopDom = document.getElementById('header-top');
    if (!headerTopDom) {
        return;
    }
    if (scrollTop > 100) {
        headerTopDom.classList.remove("header-move2");
        headerTopDom.classList.add('header-move1');
        return
    }
    headerTopDom.classList.remove('header-move1');
    headerTopDom.classList.add("header-move2");
}



// 在浏览器加载完成前执行
function ready ( fn ) {

	if ( document.addEventListener ) { //标准浏览器
        
		document.addEventListener( 'DOMContentLoaded', function () {
			//注销时间，避免重复触发
			document.removeEventListener( 'DOMContentLoaded', arguments.callee, false );
			fn(); //运行函数
		}, false );

	} else if ( document.attachEvent ) { //IE浏览器

		document.attachEvent( 'onreadystatechange', function () {

			if ( document.readyState == 'complete' ) {
				document.detachEvent( 'onreadystatechange', arguments.callee );
				fn(); //函数运行
			}

		} );
	}
}

// 执行动画
ready(function () {
    contentMove();
    initThemeToggle();
    initSiteSearch();
});
