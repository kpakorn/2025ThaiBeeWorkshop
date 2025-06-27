// script.js

console.log("🚀 script.js loaded");
let terms = [];
let sortAZ = false;                              // ← sort toggle state
const sortBtn = document.getElementById('sort-toggle');

// 1) Toggle sort on button click
sortBtn.addEventListener('click', () => {
  sortAZ = !sortAZ;
  sortBtn.textContent = sortAZ
    ? 'Sort A–Z: On'
    : 'Sort A–Z: Off';
  sortBtn.classList.toggle('active', sortAZ);
  // Re-render sidebar with current filter (or all terms)
  const q = document.getElementById('search').value.trim().toLowerCase();
  const list = q ? filterTerms(q) : terms;
  renderSidebar(list);
});

// 2) Load CSV
Papa.parse('data/dictionary.csv', {
  download: true, header: true,
  complete({ data, errors }) {
    if (errors.length) console.error("CSV errors:", errors);
    // filter out blank
    terms = data.filter(r => r.Terms && r.Terms.trim());
    renderSidebar(terms);
    if (terms.length) showTerm(terms[0].Terms);
  },
  error: err => console.error("PapaParse error:", err)
});

// 3) renderSidebar applies sortAZ if needed
function renderSidebar(list) {
  const sidebar = document.getElementById('sidebar');
  // keep the button, clear only the old terms
  sidebar.querySelectorAll('.term').forEach(el => el.remove());

  // optionally sort
  const items = sortAZ
    ? [...list].sort((a,b) => a.Terms.localeCompare(b.Terms, undefined, {sensitivity:'base'}))
    : list;

  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.Terms;
    div.classList.add('term');
    div.addEventListener('click', () => showTerm(item.Terms));
    sidebar.appendChild(div);
  });
}

// helper to filter without duplicating code
function filterTerms(query) {
  return terms.filter(r =>
    r.Terms.toLowerCase().includes(query) ||
    (r.Type         && r.Type.toLowerCase().includes(query)) ||
    (r.Descriptions && r.Descriptions.toLowerCase().includes(query))
  );
}

// 4) search listener uses filterTerms + renderSidebar + optional sort
document.getElementById('search')
  .addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = filterTerms(q);
    renderSidebar(filtered);
    if (filtered.length) showTerm(filtered[0].Terms);
    else document.getElementById('card-container')
               .innerHTML = '<p>No results found.</p>';
  });

// 5) showTerm unchanged...
function showTerm(termName) {
  document.querySelectorAll('#sidebar .term')
    .forEach(el => el.classList.toggle('active', el.textContent === termName));

  const rec = terms.find(r => r.Terms === termName);
  const c = document.getElementById('card-container');
  if (!rec) return c.innerHTML = '<p>Term not found.</p>';

  let html = '<div class="card"><div>';
  html += `<h2>${rec.Terms}</h2>`;
  if (rec.Type) html += `<p><strong>Type:</strong> ${rec.Type}</p>`;
  if (rec.Descriptions) html += `<p>${rec.Descriptions}</p>`;
  if (rec.Related_Figures) {
    html += `<p><a href="images/${rec.Related_Figures}" target="_blank">View Figure</a></p>`;
  }
  html += '</div>';
  if (rec.Related_Figures) {
    html += `<img src="images/${rec.Related_Figures}" alt="${rec.Terms} figure">`;
  }
  html += '</div>';

  c.innerHTML = html;
}
