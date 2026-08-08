const search = document.querySelector('.input-group input');
const table_headings = document.querySelectorAll('thead th');
const seriesDropdown = document.querySelector('#seriesDropdown');
const audioCheckbox = document.querySelector('#audioAvailableCheckbox');
const videoCheckbox = document.querySelector('#videoAvailableCheckbox');
const tbody = document.querySelector('tbody');
const customers_table = document.querySelector('#customers_table');
const random_btn = document.querySelector('#randomItem');
let previousRandomRow = null;

function getTableRows() {
  return document.querySelectorAll('tbody tr');
}

function filterTable() {
  const search_data = search ? search.value.toLowerCase() : '';
  const selectedSeries = seriesDropdown ? seriesDropdown.value : '';
  const requireAudio = audioCheckbox ? audioCheckbox.checked : false;
  const requireVideo = videoCheckbox ? videoCheckbox.checked : false;
  let visibleCount = 0;

  getTableRows().forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    const cells = row.querySelectorAll('td');
    const series = cells[1] ? cells[1].textContent.trim() : '';
    const audioImg = cells[2] ? cells[2].querySelector('img') : null;
    const videoImg = cells[3] ? cells[3].querySelector('img') : null;
    const hasAudio = audioImg ? /audio available/i.test(audioImg.alt || '') : false;
    const hasVideo = videoImg ? /video available/i.test(videoImg.alt || '') : false;

    const matchesSearch = !search_data || rowText.indexOf(search_data) !== -1;
    const matchesSeries = !selectedSeries || series === selectedSeries;
    const matchesAudio = !requireAudio || hasAudio;
    const matchesVideo = !requireVideo || hasVideo;
    const shouldShow = matchesSearch && matchesSeries && matchesAudio && matchesVideo;

    row.classList.toggle('hide', !shouldShow);
    if (shouldShow) {
      row.style.setProperty('--delay', visibleCount / 25 + 's');
      visibleCount += 1;
    }
  });

  document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
    visible_row.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#0000000b';
  });
}

function populateSeriesDropdown() {
  if (!seriesDropdown) return;

  const uniqueSeries = new Set();
  getTableRows().forEach((row) => {
    const seriesCell = row.querySelectorAll('td')[1];
    if (seriesCell) {
      const series = seriesCell.textContent.trim();
      if (series) uniqueSeries.add(series);
    }
  });

  seriesDropdown.innerHTML = '<option value="">All Series</option>';
  Array.from(uniqueSeries).sort().forEach((series) => {
    const option = document.createElement('option');
    option.value = series;
    option.textContent = series;
    seriesDropdown.appendChild(option);
  });
}

function createCell(content) {
  const td = document.createElement('td');
  if (typeof content === 'string') {
    td.innerHTML = content;
  } else if (content instanceof Node) {
    td.appendChild(content);
  }
  return td;
}

function resolvePageImagePath(src) {
  if (!src) return src;
  if (/^(?:https?:|\/\/|\/|\.\.)/.test(src)) return src;
  return `../${src}`;
}

function buildTableRows(items) {
  if (!tbody) return;
  tbody.innerHTML = '';

  items.forEach((item) => {
    const row = document.createElement('tr');
    const titleLink = document.createElement('a');
    titleLink.href = item.patreonLink || '#';
    titleLink.target = '_blank';

    if (item.titleImage) {
      const titleImg = document.createElement('img');
      titleImg.className = 'title_img';
      titleImg.src = resolvePageImagePath(item.titleImage);
      titleImg.alt = item.titleAlt || item.title || '';
      titleLink.appendChild(titleImg);
    }

    titleLink.insertAdjacentText('beforeend', item.title || 'Untitled');
    row.appendChild(createCell(titleLink));
    row.appendChild(createCell(item.series || ''));

    const audioCell = document.createElement('td');
    if (item.audioLink) {
      const audioAnchor = document.createElement('a');
      audioAnchor.href = item.audioLink;
      audioAnchor.target = '_blank';
      audioAnchor.innerHTML = '<img src="../images/tick-svgrepo-com.svg" alt="Audio Available">';
      audioCell.appendChild(audioAnchor);
    }
    row.appendChild(audioCell);

    const videoCell = document.createElement('td');
    if (item.videoLink) {
      const videoAnchor = document.createElement('a');
      videoAnchor.href = item.videoLink;
      videoAnchor.target = '_blank';
      videoAnchor.innerHTML = '<img src="../images/tick-svgrepo-com.svg" alt="Video Available">';
      videoCell.appendChild(videoAnchor);
    }
    row.appendChild(videoCell);

    row.appendChild(createCell(item.date || ''));
    row.appendChild(createCell(item.tier || ''));
    tbody.appendChild(row);
  });
}

function getSortValue(text) {
  const dateValue = parseDateValue(text);
  if (!Number.isNaN(dateValue)) return dateValue;

  const numeric = parseFloat(text.replace(/[^0-9.\-]/g, ''));
  if (!Number.isNaN(numeric) && /\d/.test(text)) return numeric;

  return text.toLowerCase();
}

function parseDateValue(value) {
  value = value.trim();
  if (!value) return NaN;

  const numericDashes = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (numericDashes) {
    let [, part1, part2, part3] = numericDashes;
    if (part3.length === 2) part3 = '20' + part3;
    value = `${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function sortTable(column, sort_asc) {
  const rows = [...getTableRows()].sort((a, b) => {
    const first_text = a.querySelectorAll('td')[column]?.textContent.toLowerCase().trim() || '';
    const second_text = b.querySelectorAll('td')[column]?.textContent.toLowerCase().trim() || '';

    const first_value = getSortValue(first_text);
    const second_value = getSortValue(second_text);

    if (first_value > second_value) return sort_asc ? -1 : 1;
    if (first_value < second_value) return sort_asc ? 1 : -1;
    return 0;
  });
  rows.forEach((sorted_row) => tbody.appendChild(sorted_row));
}

function pickRandomItem(table) {
  if (!table) return;
  const visible_rows = [...table.querySelectorAll('tbody tr:not(.hide)')];
  if (!visible_rows.length) return;

  const available_rows = visible_rows.filter((row) => row !== previousRandomRow);
  if (!available_rows.length) {
    previousRandomRow = null;
    return pickRandomItem(table);
  }

  visible_rows.forEach((row) => {
    row.classList.remove('selected-row');
    row.style.backgroundColor = '';
  });

  const random_row = available_rows[Math.floor(Math.random() * available_rows.length)];
  previousRandomRow = random_row;
  random_row.classList.add('selected-row');
  random_row.style.backgroundColor = 'rgba(255, 111, 0, 0.12)';
  random_row.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setActiveColumn(index) {
  document.querySelectorAll('td').forEach((td) => td.classList.remove('active'));
  getTableRows().forEach((row) => {
    const cell = row.querySelectorAll('td')[index];
    if (cell) cell.classList.add('active');
  });
}

function loadPatreonData() {
  if (!customers_table || !tbody) return;

  fetch('patreoncontent.json')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load JSON data');
      return response.json();
    })
    .then((data) => {
      buildTableRows(data);
      populateSeriesDropdown();
      filterTable();
      const dateHeader = table_headings[4];
      if (dateHeader) {
        dateHeader.classList.add('active');
        setActiveColumn(4);
        sortTable(4, true);
      }
    })
    .catch((error) => console.error('Error loading Patreon JSON:', error));
}

if (customers_table && tbody) {
  if (search) search.addEventListener('input', filterTable);
  if (audioCheckbox) audioCheckbox.addEventListener('change', filterTable);
  if (videoCheckbox) videoCheckbox.addEventListener('change', filterTable);
  if (seriesDropdown) seriesDropdown.addEventListener('change', filterTable);
  if (random_btn) random_btn.onclick = () => pickRandomItem(customers_table);

  document.addEventListener('DOMContentLoaded', loadPatreonData);

  table_headings.forEach((head, i) => {
    let sort_asc = true;
    if (i !== 4) return;

    head.onclick = () => {
      table_headings.forEach((heading) => heading.classList.remove('active'));
      head.classList.add('active');
      setActiveColumn(i);
      head.classList.toggle('asc', sort_asc);
      sort_asc = head.classList.contains('asc') ? false : true;
      sortTable(i, sort_asc);
    };
  });
}
