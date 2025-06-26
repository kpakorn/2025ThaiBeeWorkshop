let terms = [];
Papa.parse('data/dictionary.csv', {
  download: true, header: true,
  complete: ({ data }) => {
    terms = data.filter(r => r.wording);
    renderSidebar(terms);
    showTerm(terms[0].wording);
  }
});

function renderSidebar(list) {
  const nav = document.getElementById('sidebar');
  nav.innerHTML = '';
  list.forEach(r => {
    const div = document.createElement('div');
    div.textContent = r.wording;
    div.className = 'term';
    div.onclick = () => showTerm(r.wording);
    nav.appendChild(div);
  });
}

function showTerm(word) {
  document.querySelectorAll('#sidebar .term')
    .forEach(el => el.classList.toggle('active', el.textContent === word));
  const record = terms.find(r => r.wording === word);
  document.getElementById('card-container').innerHTML = `
    <div class="card">
      <div>
        <h2>${record.wording}</h2>
        <p>${record.definition}</p>
        <a href="images/${record.reference}.png" target="_blank">
          Figure ${record.reference}
        </a>
      </div>
      <img src="images/${record.reference}.png" alt="Figure ${record.reference}">
    </div>`;
}

document.getElementById('search')
  .addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = terms.filter(r =>
      r.wording.toLowerCase().includes(q) ||
      r.definition.toLowerCase().includes(q)
    );
    renderSidebar(filtered);
    if (filtered.length) showTerm(filtered[0].wording);
  });
