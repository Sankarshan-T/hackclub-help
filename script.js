(function () {
    const searchInput = document.getElementById('event-search');
    const statusText = document.getElementById('event-search-status');
    const eventCards = Array.from(document.querySelectorAll('#events-grid .event-card'));

    if (!searchInput || !statusText || eventCards.length === 0) return;

    const total = eventCards.length;

    function updateSearch() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        eventCards.forEach((card) => {
            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const channel = card.querySelector('.event-channel')?.textContent?.toLowerCase() || '';
            const icon = card.querySelector('.event-icon')?.textContent?.toLowerCase() || '';
            const haystack = `${title} ${channel} ${icon}`;
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
})();
