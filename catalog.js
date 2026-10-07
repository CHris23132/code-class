document.getElementById('year').textContent = new Date().getFullYear();

const chips = [...document.querySelectorAll('.goal-chip')];
const cards = [...document.querySelectorAll('.course-card')];
const count = document.getElementById('catalog-count');

function applyGoal(goal, updateUrl) {
  const chip = chips.find(c => c.dataset.goal === goal) || chips[0];
  goal = chip.dataset.goal;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
  const row = chip.parentElement;
  if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: updateUrl ? 'smooth' : 'auto' });
  const best = chip.dataset.best;
  for (const card of cards) {
    const isBest = card.dataset.slug === best;
    card.classList.remove('is-best');
    if (isBest) { void card.offsetWidth; card.classList.add('is-best'); }
    card.classList.toggle('is-dim', goal !== 'all' && !isBest && !card.dataset.goals.split(' ').includes(goal));
  }
  const bestCard = cards.find(card => card.dataset.slug === best);
  count.textContent = bestCard ? `Best match: ${bestCard.dataset.name}` : `${cards.length} courses`;
  if (updateUrl) {
    const url = new URL(location.href);
    if (goal === 'all') url.searchParams.delete('goal'); else url.searchParams.set('goal', goal);
    history.replaceState(null, '', url);
  }
}

chips.forEach(chip => chip.addEventListener('click', () => applyGoal(chip.dataset.goal, true)));
applyGoal(new URLSearchParams(location.search).get('goal') || 'all', false);
