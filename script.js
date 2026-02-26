// ================= SUPABASE INIT =================
const { createClient } = supabase;

const supabaseClient = createClient(
  'https://fllgcdidreolzabsnkrh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbGdjZGlkcmVvbHphYnNua3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjczMDgsImV4cCI6MjA4NzY0MzMwOH0.R3TWhFg7aflUivMHI7V9LHl_2e1wpOcTRWZnfO15qSA'
);

// ================= AUTH CHECK (STRICT) =================
const isLoggedIn = localStorage.getItem('isLoggedIn');
const currentEmployee = localStorage.getItem('currentEmployee');

if (isLoggedIn !== 'true' || !currentEmployee) {
    window.location.replace('login.html');
    throw new Error("Redirecting to login...");
}

// ================= DOM ELEMENTS =================
const table = document.getElementById('pcTable');
const tbody = table ? table.tBodies[0] : null;
const searchInput = document.querySelector('.search-wrapper input');
const addBtn = document.querySelector('.add-btn');

// ================= LOAD DATA =================
async function loadPCs() {
  if (!tbody) return;
  const { data, error } = await supabaseClient
    .from('pcs')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    alert('Failed to load PCs');
    return;
  }
  tbody.innerHTML = '';
  data.forEach(addRowToTable);
}

function addRowToTable(pc) {
  const row = tbody.insertRow();
  row.dataset.id = pc.id;
  row.innerHTML = `
    <td>${pc.plant || ''}</td>
    <td>${pc.department || ''}</td>
    <td>${pc.old_pc_name || ''}</td>
    <td>${pc.old_serial || ''}</td>
    <td>${pc.new_pc_name || ''}</td>
    <td>${pc.new_serial || ''}</td>
    <td>${pc.ipv4 || ''}</td>
    <td class="status ${pc.status === 'Replaced' ? 'replaced' : 'not-replaced'}">
      ${pc.status || 'Not Replaced'}
    </td>
  `;
}

// ================= TABLE SORTING LOGIC =================
if (table) {
    table.querySelectorAll('th').forEach((header, index) => {
        header.style.cursor = 'pointer'; // Make it look clickable
        header.addEventListener('click', () => {
            const rows = Array.from(tbody.rows);
            const isAscending = header.classList.contains('sort-asc');
            
            // Toggle sort direction
            table.querySelectorAll('th').forEach(th => th.classList.remove('sort-asc', 'sort-desc'));
            header.classList.toggle('sort-asc', !isAscending);
            header.classList.toggle('sort-desc', isAscending);

            rows.sort((a, b) => {
                const cellA = a.cells[index].textContent.toLowerCase();
                const cellB = b.cells[index].textContent.toLowerCase();

                if (cellA < cellB) return isAscending ? 1 : -1;
                if (cellA > cellB) return isAscending ? -1 : 1;
                return 0;
            });

            // Re-append rows in new order
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// ================= SEARCH =================
if (searchInput) {
    searchInput.addEventListener('input', () => {
      const filter = searchInput.value.toLowerCase();
      Array.from(tbody.rows).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
      });
    });
}

// ================= CLICK TO EDIT LISTENER =================
if (tbody) {
    tbody.addEventListener('click', e => {
        const row = e.target.closest('tr');
        if (!row) return;
        openEditPopup(row);
    });
}

// ================= EDIT POPUP =================
function openEditPopup(row) {
  const id = row.dataset.id;
  const cells = row.cells;
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';

  popup.innerHTML = `
    <div class="popup-content">
      <span class="close-x" id="x-close">&times;</span>
      <h2>Edit PC Details</h2>
      <label>Plant <input value="${cells[0].textContent}"></label>
      <label>Department <input value="${cells[1].textContent}"></label>
      <label>Old PC Name <input value="${cells[2].textContent}"></label>
      <label>Old Serial <input value="${cells[3].textContent}"></label>
      <label>New PC Name <input value="${cells[4].textContent}"></label>
      <label>New Serial <input value="${cells[5].textContent}"></label>
      <label>IPv4 <input value="${cells[6].textContent}"></label>
      <label>Status
        <select>
          <option ${cells[7].textContent.trim() === 'Replaced' ? 'selected' : ''}>Replaced</option>
          <option ${cells[7].textContent.trim() === 'Not Replaced' ? 'selected' : ''}>Not Replaced</option>
        </select>
      </label>
      <div class="popup-buttons">
        <button id="delete-btn" class="btn-danger">Delete PC</button>
        <div style="flex-grow: 1;"></div> 
        <button id="save-btn" style="background-color: #10b981; color: white;">Save Changes</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  popup.querySelector('#x-close').onclick = () => popup.remove();

  popup.querySelector('#delete-btn').onclick = async () => {
    if (confirm(`Are you sure?`)) {
      const { error } = await supabaseClient.from('pcs').delete().eq('id', id);
      if (!error) { popup.remove(); loadPCs(); }
    }
  };

  popup.querySelector('#save-btn').onclick = async () => {
    const inputs = popup.querySelectorAll('input, select');
    const { error } = await supabaseClient.from('pcs').update({
        plant: inputs[0].value, department: inputs[1].value,
        old_pc_name: inputs[2].value, old_serial: inputs[3].value,
        new_pc_name: inputs[4].value, new_serial: inputs[5].value,
        ipv4: inputs[6].value, status: inputs[7].value
    }).eq('id', id);
    if (!error) { popup.remove(); loadPCs(); }
  };
}

// ================= ADD POPUP =================
if (addBtn) {
    addBtn.addEventListener('click', () => {
      const popup = document.createElement('div');
      popup.className = 'popup-overlay';
      popup.innerHTML = `
        <div class="popup-content">
          <span class="close-x" id="x-close-add">&times;</span>
          <h2>Add New PC</h2>
          <label>Plant <input placeholder="Plant"></label>
          <label>Department <input placeholder="Dept"></label>
          <label>Old PC Name <input placeholder="Name"></label>
          <label>Old Serial <input placeholder="Serial"></label>
          <label>New PC Name <input placeholder="New Name"></label>
          <label>New Serial <input placeholder="New Serial"></label>
          <label>IPv4 <input placeholder="IP"></label>
          <label>Status
            <select><option>Not Replaced</option><option>Replaced</option></select>
          </label>
          <div class="popup-buttons">
            <button id="add-save-btn" style="background-color: #10b981; color: white; width: 100%;">Add PC Record</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
      popup.querySelector('#x-close-add').onclick = () => popup.remove();
      popup.querySelector('#add-save-btn').onclick = async () => {
        const inputs = popup.querySelectorAll('input, select');
        const { error } = await supabaseClient.from('pcs').insert({
          plant: inputs[0].value, department: inputs[1].value,
          old_pc_name: inputs[2].value, old_serial: inputs[3].value,
          new_pc_name: inputs[4].value, new_serial: inputs[5].value,
          ipv4: inputs[6].value, status: inputs[7].value
        });
        if (!error) { popup.remove(); loadPCs(); }
      };
    });
}

// ================= LOGOUT =================
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.onclick = () => { localStorage.clear(); window.location.replace('login.html'); };
}

loadPCs();