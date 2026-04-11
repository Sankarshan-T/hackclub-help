(function () {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function applyExternalLinkTargets(root) {
        const container = root || document;
        const links = container.querySelectorAll('a[href]:not([href^="#"])');

        links.forEach(function (link) {
            link.setAttribute('target', '_blank');

            const href = link.getAttribute('href') || '';
            if (/^https?:\/\//i.test(href)) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    applyExternalLinkTargets(document);

    if (navbar && navToggle) {
        navToggle.addEventListener('click', function () {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navbar.classList.toggle('menu-open', !expanded);
        });

        document.addEventListener('click', function (event) {
            const clickedInsideNav = navbar.contains(event.target);
            if (!clickedInsideNav && navbar.classList.contains('menu-open')) {
                navbar.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 900 && navbar.classList.contains('menu-open')) {
                navbar.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

            window.scrollTo({
                top: Math.max(top, 0),
                behavior: 'smooth'
            });

            if (navbar && navToggle) {
                navbar.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const searchInput = document.getElementById('event-search');
    const statusText = document.getElementById('event-search-status');
    const eventsGrid = document.getElementById('events-grid');

    if (!searchInput || !statusText || !eventsGrid) return;

    const events = [
        { name: 'Resolution', channel: '#resolution-help', link: 'https://hackclub.enterprise.slack.com/archives/C0A80KVN6MA' },
        { name: 'Sleepover', image: 'images/sleepover.png', channel: '#athena-sleepover', link: 'https://hackclub.enterprise.slack.com/archives/C0A9UNRF96V' },
        { name: 'Enclosure', image: 'images/enclosure.png', channel: '#enclosure-help', link: 'https://hackclub.enterprise.slack.com/archives/C0AQR65RE02' },
        { name: 'Trailit', image: 'images/trailit.png', channel: '#trailit-ysws', link: 'https://hackclub.enterprise.slack.com/archives/C0AGG8J6PLL' },
        { name: 'Fallout', image: 'images/fallout.png', channel: '#fallout-help', link: 'https://hackclub.enterprise.slack.com/archives/C0ACJ290090' },
        { name: 'Remixed', image: 'images/remixed.png', channel: '#remixed-help', link: 'https://hackclub.enterprise.slack.com/archives/C0AK7L0B9A6' },
        { name: 'Hackcraft', image: 'images/hackcraft.png', channel: '#mc-modding', link: 'https://hackclub.enterprise.slack.com/archives/C07NQ5QAYNQ' },
        { name: 'Stasis', image: 'images/stasis.png', channel: '#stasis-support', link: 'https://hackclub.enterprise.slack.com/archives/C09JP51FHNE' },
        { name: 'Coeur', image: 'images/coeur.png', channel: '#coeur', link: 'https://hackclub.enterprise.slack.com/archives/C0A6MCHFFEU' },
        { name: 'Boot', image: 'images/boot.png', channel: '#boot', link: 'https://hackclub.enterprise.slack.com/archives/C09EWDU9ZQT' },
        { name: 'Hack Club: The Game', image: 'images/hctg.png', channel: '#hctg-help', link: 'https://hackclub.enterprise.slack.com/archives/C0A9XULS1SL' },
        { name: 'Boba Drops', image: 'images/boba.png', channel: '#boba', link: 'https://hackclub.enterprise.slack.com/archives/C06UJR8QW0M' },
        { name: 'Horizons', image: 'images/horizons.png', channel: '#horizons-help', link: 'https://hackclub.enterprise.slack.com/archives/C0AFLAUT58A' },
        { name: 'Sprig', image: 'images/sprig.png', channel: '#sprig', link: 'https://hackclub.enterprise.slack.com/archives/C02UN35M7LG' },
        { name: 'Construct', image: 'images/construct.png', channel: '#construct-help', link: 'https://hackclub.enterprise.slack.com/archives/C09QSTUV88Y' },
        { name: 'Flavortown', image: 'images/flavortown.png', channel: '#flavortown-help', link: 'https://hackclub.enterprise.slack.com/archives/C09MATKQM8C' },
        { name: 'Campfire Flagship', image: 'images/campfire.png', channel: '#campfire-flagship-help', link: 'https://hackclub.enterprise.slack.com/archives/C0A6KLGRZQE' }
    ];

    function renderEventCard(event) {
        const iconMarkup = event.image
            ? `<img src="${event.image}" alt="${event.name} logo" class="event-icon-img" loading="lazy" />`
            : `<span class="event-icon-fallback" aria-hidden="true">${event.name.slice(0, 1)}</span>`;

        return `
            <a href="${event.link}" class="event-card card interactive">
                <span class="event-icon" aria-hidden="true">${iconMarkup}</span>
                <h3>${event.name}</h3>
                <div class="event-channel pill">${event.channel}</div>
            </a>
        `;
    }

    eventsGrid.innerHTML = events.map(renderEventCard).join('');
    applyExternalLinkTargets(eventsGrid);

    const eventCards = Array.from(eventsGrid.querySelectorAll('.event-card'));

    const total = eventCards.length;

    function updateSearch() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        eventCards.forEach((card) => {
            const eventName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const channelName = card.querySelector('.event-channel')?.textContent?.toLowerCase() || '';
            const haystack = `${eventName} ${channelName}`;
            const isMatch = query === '' || haystack.includes(query);

            card.hidden = !isMatch;
            if (isMatch) visibleCount += 1;
        });

        if (query === '') {
            statusText.textContent = 'Showing all channels';
            return;
        }

        if (visibleCount === 0) {
            statusText.textContent = `No channels found for "${query}"`;
            return;
        }

        statusText.textContent = `Showing ${visibleCount} of ${total} channels`;
    }

    searchInput.addEventListener('input', updateSearch);
    updateSearch();
})();
