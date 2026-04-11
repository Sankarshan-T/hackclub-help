(function () {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

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
        { name: 'Resolution', icon: '🦖', channel: '#resolution-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Sleepover', icon: '⛺', channel: '#athena-sleepover', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Enclosure', icon: '📦', channel: '#enclosure-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Trailit', icon: '🛤️', channel: '#trailit-ysws', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Fallout', icon: '☢️', channel: '#fallout-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Remixed', icon: '📻', channel: '#remixed-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Hackcraft', icon: '⛏️', channel: '#mc-modding', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Stasis', icon: '⏸️', channel: '#stasis-support', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Coeur', icon: '❤️', channel: '#coeur', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Boot', icon: '👢', channel: '#boot', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Hack Club: The Game', icon: '🕹️', channel: '#hctg-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Boba Drops', icon: '🧋', channel: '#boba', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Horizons', icon: '🌅', channel: '#horizons-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Sprig', icon: '🌱', channel: '#sprig', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Construct', icon: '🏗️', channel: '#construct-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Flavortown', icon: '🍔', channel: '#flavortown-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' },
        { name: 'Campfire Flagship', icon: '🏕️', channel: '#campfire-flagship-help', link: 'https://hackclub.enterprise.slack.com/archives/channelidhere' }
    ];

    function renderEventCard(event) {
        return `
            <a href="${event.link}" class="event-card card interactive">
                <span class="event-icon">${event.icon}</span>
                <h3>${event.name}</h3>
                <div class="event-channel pill">${event.channel}</div>
            </a>
        `;
    }

    eventsGrid.innerHTML = events.map(renderEventCard).join('');

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
