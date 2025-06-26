let terms = [];

/* Banner at top of page */
#site-banner {
  width: 100%;            /* still full-width */
  max-height: 200px;      /* cap the height */
  object-fit: cover;      /* crop/scale to fill the box */
  display: block;
  margin-bottom: 1rem;
}



// 1) Load CSV with new headers
Papa.parse('data/dictionary.csv', {
  download: true,
  header: true,
  complete: ({ data }) => {
    // Filter out any empty rows
    terms = data.filter(r => r.Terms);
    renderSidebar(terms);
    // Show first term by default
    showTerm(terms[0].Terms);
  }
});

function renderSidebar(list) {
  const nav = document.getElementById('sidebar');
  nav.innerHTML = '';
  list.forEach(r => {
    const div = document.createElement('div');
    div.textContent = r.Terms;
    div.className = 'term';
    div.onclick = () => showTerm(r.Terms);
    nav.appendChild(div);
  });
}

function showTerm(word) {
  // Highlight in sidebar
  document.querySelectorAll('#sidebar .term')
    .forEach(el => el.classList.toggle('active', el.textContent === word));

  const record = terms.find(r => r.Terms === word);
  const container = document.getElementById('card-container');

  // Build card HTML, showing Type and handling possible blank image
  container.innerHTML = `
    <div class="card">
      <div>
        <h2>${record.Terms}</h2>
        <p><strong>Type:</strong> ${record.Type}</p>
        <p>${record.Descriptions}</p>
        ${record.Related_Figures
          ? `<a href="images/${record.Related_Figures}" target="_blank">
               View Figure
             </a>`
          : ``}
      </div>
      ${record.Related_Figures
        ? `<img src="images/${record.Related_Figures}"
                alt="${record.Terms} figure">`
        : ``}
    </div>
  `;
}

// 4) Search now also looks in Descriptions (optional: include Type)
document.getElementById('search')
  .addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = terms.filter(r =>
      r.Terms.toLowerCase().includes(q) ||
      r.Type.toLowerCase().includes(q) ||
      r.Descriptions.toLowerCase().includes(q)
    );
    renderSidebar(filtered);
    if (filtered.length) showTerm(filtered[0].Terms);
  });
