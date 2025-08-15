// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// Try to load games.html
fetch('games.html')
  .then(res => {
    if (!res.ok) throw new Error('Network error');
    return res.text();
  })
  .then(html => {
    document.getElementById('grid').innerHTML = html;
    initFilters();
  })
  .catch(() => {
    // Offline mode: fallback to embedded template
    const tpl = document.getElementById('games-template');
    if (tpl) {
      document.getElementById('grid').innerHTML = tpl.innerHTML.trim();
      initFilters();
    }
  });

function initFilters() {
  const search = document.getElementById('search');
  const pills = Array.from(document.querySelectorAll('.pill'));
  const cards = Array.from(document.querySelectorAll('.card'));
  let currentCat = 'all';

  function applyFilters() {
    const q = (search.value || '').toLowerCase().trim();
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const cat = card.getAttribute('data-cat');
      const title = card.querySelector('.title').textContent.toLowerCase();
      const matchesText = !q || tags.includes(q) || title.includes(q);
      const matchesCat = currentCat === 'all' || currentCat === cat;
      card.style.display = (matchesText && matchesCat) ? '' : 'none';
    });
  }

  search.addEventListener('input', applyFilters);

  pills.forEach(p => p.addEventListener('click', () => {
    pills.forEach(x => x.dataset.active = 'false');
    p.dataset.active = 'true';
    currentCat = p.dataset.filter;
    applyFilters();
  }));
}
