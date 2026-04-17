(function () {
    const navbar = document.querySelector('.nav');
    const navtoggle = document.querySelector('.toggle');
    const navlinks = document.querySelectorAll('.links a[href^="#"]');

    function openlinksinnewtab(root) {
        const scope = root || document;
        const links = scope.querySelectorAll('a[href]:not([href^="#"])');

        links.forEach(function (link) {
            link.setAttribute('target', '_blank');

            const href = link.getAttribute('href') || '';
            if (/^https?:\/\//i.test(href)) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    openlinksinnewtab(document);

    if (navbar && navtoggle) {
        navtoggle.addEventListener('click', function () {
            const isexpanded = navtoggle.getAttribute('aria-expanded') === 'true';
            navtoggle.setAttribute('aria-expanded', String(!isexpanded));
            navbar.classList.toggle('menuopen', !isexpanded);
        });

        document.addEventListener('click', function (event) {
            const clickedinsidenav = navbar.contains(event.target);
            if (!clickedinsidenav && navbar.classList.contains('menuopen')) {
                navbar.classList.remove('menuopen');
                navtoggle.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 900 && navbar.classList.contains('menuopen')) {
                navbar.classList.remove('menuopen');
                navtoggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    navlinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            const targetid = link.getAttribute('href');
            if (!targetid || targetid === '#') return;

            const target = document.querySelector(targetid);
            if (!target) return;

            event.preventDefault();
            const navheight = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navheight - 8;

            window.scrollTo({
                top: Math.max(top, 0),
                behavior: 'smooth'
            });

            if (navbar && navtoggle) {
                navbar.classList.remove('menuopen');
                navtoggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const searchinput = document.getElementById('eventsearch');
    const statustext = document.getElementById('eventsearchstatus');
    const eventsgrid = document.getElementById('eventsgrid');

    if (!searchinput || !statustext || !eventsgrid) return;

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

    function rendereventcard(event) {
        const iconmarkup = event.image
            ? `<img src="${event.image}" alt="${event.name} logo" class="eventimg" loading="lazy" />`
            : `<span class="eventfallback" aria-hidden="true">${event.name.slice(0, 1)}</span>`;

        return `
            <a href="${event.link}" class="eventcard card interactive">
                <span class="eventicon" aria-hidden="true">${iconmarkup}</span>
                <h3>${event.name}</h3>
                <div class="eventchannel pill">${event.channel}</div>
            </a>
        `;
    }

    eventsgrid.innerHTML = events.map(rendereventcard).join('');
    openlinksinnewtab(eventsgrid);

    const eventcards = Array.from(eventsgrid.querySelectorAll('.eventcard'));

    const totalcards = eventcards.length;

    const btn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    btn.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        let theme = "light";
        if (document.body.classList.contains("dark-theme")) {
            theme = "dark";
            btn.innerHTML = "☀️"
        } else {
            btn.innerHTML = "🌙"
        }
        localStorage.setItem("theme", theme);
    });



    function updatesearch() {
        const query = searchinput.value.trim().toLowerCase();
        let visiblecount = 0;

        eventcards.forEach((card) => {
            const eventname = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const channelname = card.querySelector('.eventchannel')?.textContent?.toLowerCase() || '';
            const haystack = `${eventname} ${channelname}`;
            const ismatch = query === '' || haystack.includes(query);

            card.hidden = !ismatch;
            if (ismatch) visiblecount += 1;
        });

        if (query === '') {
            statustext.textContent = 'Showing all channels';
            return;
        }

        if (visiblecount === 0) {
            statustext.textContent = `No channels found for "${query}"`;
            return;
        }

        statustext.textContent = `Showing ${visiblecount} of ${totalcards} channels`;
    }

    searchinput.addEventListener('input', updatesearch);
    updatesearch();
})();
