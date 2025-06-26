// script.js

// Confirm script loaded
console.log("🚀 script.js loaded");

// Global array for terms\let terms = [];

// Parse CSV and initialize
Papa.parse('data/dictionary.csv', {
  download: true,
  header: true,
  complete: ({ data, errors }) => {
    if (errors.length) {
      console.error("❌ CSV parse errors:", errors);
    }
    console.log("📑 Parsed CSV rows:", data.length);
    
    // Filter out rows without a valid Terms field
    terms = data.filter(r => r.Terms && r.Terms.trim() !== "");
    console.log("📝 Valid terms:", terms.map(r => r.Terms));
    
    // Render the sidebar and show first term if available
    renderSidebar(terms);
    if (terms.length) {
      showTerm(terms[0].Terms);
    } else {
      document.getElementById('card-container').innerHTML = '<p>No terms available.</p>';
    }
  },
  error: err => {
    console.error("❌ PapaParse error:", err);
  }
});

// Render sidebar navigation list
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
function showTerm(termName) {
  // Highlight the active term
  document.querySelectorAll('#sidebar .term').forEach(el => {
    el.classList.toggle('active', el.textContent === termName);
  });

  const record = terms.find(r => r.Terms === termName);
  const container = document.getElementById('card-container');
  
  if (!record) {
    container.innerHTML = '<p>Term not found.</p>';
    return;
  }

  // Optional figure handling
  const fig = record.Related_Figures && record.Related_Figures.trim() !== "" ? record.Related_Figures.trim() : null;
  const figLink = fig ? `<p><a href="images/${fig}" target="_blank">View Figure</a></p>` : '';
  const figImg = fig ? `<img src="images/${fig}" alt="${record.Terms} figure">` : '';

  // Build and inject the card markup
  container.innerHTML = `
    <div class="card">
      <div>
        <h2>${record.Terms}</h2>
        <p><strong>Type:</strong> ${record.Type}</p>
        <p>${record.Descriptions}</p>
        ${figLink}
      </\/div>
      ${figImg}
    <\/div>
  `;
}

// Search functionality: filter sidebar & show first match
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
