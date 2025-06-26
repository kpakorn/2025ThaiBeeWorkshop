

/* Banner at top of page */
#site-banner {
  display: block;        /* removes inline gaps */
  width: 100%;           /* full‐width */
  max-width: 1200px;     /* never wider than this */
  max-height: 200px;     /* cap the height */
  object-fit: cover;     /* crop/scale rather than squash */
  margin: 0 auto 1rem;   /* center & space below */
}


let terms = [];

// Load CSV with new headers
Papa.parse('data/dictionary.csv', {
  download: true,
  header: true,
  complete: ({ data }) => {
    // Filter out any empty rows
    terms = data.filter(r => r.Terms);
    renderSidebar(terms);
    // Show first term by default if exists
    if (terms.length > 0) {
      showTerm(terms[0].Terms);
    }
  }
});

// Render the sidebar list of terms
function renderSidebar(list) {
  const nav = document.getElementById('sidebar');
  nav.innerHTML = '';
  list.forEach(record => {
    const termDiv = document.createElement('div');
    termDiv.textContent = record.Terms;
    termDiv.className = 'term';
    termDiv.onclick = () => showTerm(record.Terms);
    nav.appendChild(termDiv);
  });
}

// Display a single term card in the main area
function showTerm(word) {
  // Highlight the active term in the sidebar
  document.querySelectorAll('#sidebar .term').forEach(el => {
    el.classList.toggle('active', el.textContent === word);
  });

  const record = terms.find(r => r.Terms === word);
  const container = document.getElementById('card-container');

  if (!record) {
    container.innerHTML = '<p>No data found.</p>';
    return;
  }

  // Build optional figure link and image
  const figureLink = record.Related_Figures
    ? `<a href="images/${record.Related_Figures}" target="_blank">View Figure</a>`
    : '';
  const figureImage = record.Related_Figures
    ? `<img src="images/${record.Related_Figures}" alt="${record.Terms} figure">`
    : '';

  // Populate the card container
  container.innerHTML = `
    <div class="card">
      <div>
        <h2>${record.Terms}</h2>
        <p><strong>Type:</strong> ${record.Type}</p>
        <p>${record.Descriptions}</p>
        ${figureLink}
      </div>
      ${figureImage}
    </div>
  `;
}

// Search functionality: filters sidebar and shows first match
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filtered = terms.filter(r => 
    r.Terms.toLowerCase().includes(q) ||
    r.Type.toLowerCase().includes(q) ||
    r.Descriptions.toLowerCase().includes(q)
  );
  renderSidebar(filtered);
  if (filtered.length) {
    showTerm(filtered[0].Terms);
  } else {
    document.getElementById('card-container').innerHTML = '<p>No results found.</p>';
  }
});

