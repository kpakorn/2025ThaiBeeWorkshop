// script.js

// Confirm script loaded
console.log("🚀 script.js loaded");

// Global array for terms
let terms = [];

// Load and parse the CSV dictionary
Papa.parse('data/dictionary.csv', {
  download: true,
  header: true,
  complete: function(results) {
    // Log any parse errors
    if (results.errors.length) {
      console.error("❌ CSV parse errors:", results.errors);
    }
    const data = results.data;
    console.log("📑 Parsed CSV rows:", data.length);

    // Filter out rows without a Terms value
    terms = data.filter(row => row.Terms && row.Terms.trim() !== "");
    console.log("📝 Valid terms:", terms.map(r => r.Terms));

    // **Sort terms A→Z by the Terms field**
    terms.sort((a, b) =>
      a.Terms.localeCompare(b.Terms, undefined, { sensitivity: 'base' })
    );

    // Render the sidebar list and show the first term
    renderSidebar(terms);
    if (terms.length > 0) {
      showTerm(terms[0].Terms);
    } else {
      document.getElementById('card-container').innerHTML = '<p>No terms available.</p>';
    }
  },
  error: function(err) {
    console.error("❌ PapaParse error:", err);
  }
});

/**
 * Populate the left sidebar with clickable term names
 */
function renderSidebar(list) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.Terms;
    div.classList.add('term');
    div.addEventListener('click', () => showTerm(item.Terms));
    sidebar.appendChild(div);
  });
}

/**
 * Display a single term's details in the main card area
 */
function showTerm(termName) {
  // Highlight active term
  document.querySelectorAll('#sidebar .term').forEach(el => {
    el.classList.toggle('active', el.textContent === termName);
  });

  const record = terms.find(r => r.Terms === termName);
  const container = document.getElementById('card-container');

  if (!record) {
    container.innerHTML = '<p>Term not found.</p>';
    return;
  }

  // Build HTML for the card
  let cardHTML = '<div class="card">';
  cardHTML += '<div>';
  cardHTML += `<h2>${record.Terms}</h2>`;
  if (record.Type) {
    cardHTML += `<p><strong>Type:</strong> ${record.Type}</p>`;
  }
  if (record.Descriptions) {
    cardHTML += `<p>${record.Descriptions}</p>`;
  }
  if (record.Related_Figures) {
    cardHTML += `<p><a href="images/${record.Related_Figures}" target="_blank">View Figure</a></p>`;
  }
  cardHTML += '</div>';
  if (record.Related_Figures) {
    cardHTML += `<img src="images/${record.Related_Figures}" alt="${record.Terms} figure">`;
  }
  cardHTML += '</div>';

  container.innerHTML = cardHTML;
}

/**
 * Filter terms as the user types in the search box
 */
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', function(e) {
  const q = e.target.value.toLowerCase();
  const filtered = terms.filter(r =>
    r.Terms.toLowerCase().includes(q) ||
    (r.Type && r.Type.toLowerCase().includes(q)) ||
    (r.Descriptions && r.Descriptions.toLowerCase().includes(q))
  );
  renderSidebar(filtered);
  if (filtered.length > 0) {
    showTerm(filtered[0].Terms);
  } else {
    document.getElementById('card-container').innerHTML = '<p>No results found.</p>';
  }
});

