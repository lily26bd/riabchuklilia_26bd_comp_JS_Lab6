const urlInput = document.getElementById('urlInput');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const status = document.getElementById('status');
const displayPrompt = document.getElementById('displayPrompt');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const tableContainer = document.getElementById('tableContainer');

let jsonData = [];
let currentSort = { key: null, asc: true };

loadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return;

  try {
    loadBtn.disabled = true;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Помилка ${response.status}: ${response.statusText}`);
    }

    jsonData = await response.json();
    status.textContent = `Дані формату JSON успішно завантажено. Кількість записів рівна ${jsonData.length}.`;
    displayPrompt.style.display = 'block';
    clearBtn.disabled = false;
  } catch (error) {
    status.textContent = error.message;
    loadBtn.disabled = true;
    clearBtn.disabled = false;
  }
});

clearBtn.addEventListener('click', () => {
  urlInput.value = '';
  status.textContent = '';
  displayPrompt.style.display = 'none';
  tableContainer.innerHTML = '';
  jsonData = [];
  currentSort = { key: null, asc: true };
  loadBtn.disabled = false;
  clearBtn.disabled = true;
});

yesBtn.addEventListener('click', () => {
  renderTable(jsonData);
});

noBtn.addEventListener('click', () => {
  tableContainer.innerHTML = '';
});

function renderTable(data) {
  const table = document.createElement('table');
  const headers = ['id', 'name', 'username', 'email'];

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  headers.forEach(key => {
    const th = document.createElement('th');
    th.classList.add('sortable');
    th.textContent = key.toUpperCase();

    if (currentSort.key === key) {
      th.classList.add('sorted');
      th.textContent += currentSort.asc ? ' ↑' : ' ↓';
    }

    th.addEventListener('click', () => {
      const asc = currentSort.key === key ? !currentSort.asc : true;
      currentSort = { key, asc };
      const sortedData = [...data].sort((a, b) => {
        return asc ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      });
      renderTable(sortedData);
    });

    tr.appendChild(th);
  });

  const clearSortBtn = document.createElement('button');
  clearSortBtn.textContent = 'ОЧИСТИТИ СОРТУВАННЯ';
  clearSortBtn.classList.add('btn', 'red');
  clearSortBtn.onclick = () => {
    currentSort = { key: null, asc: true };
    renderTable(jsonData);
  };

  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach(user => {
    const row = document.createElement('tr');
    headers.forEach(key => {
      const td = document.createElement('td');
      td.textContent = user[key];
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.innerHTML = '';
  tableContainer.appendChild(clearSortBtn);
  tableContainer.appendChild(table);
}
