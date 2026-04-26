function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnavmobile") {
    x.className += " responsive";
  } else {
    x.className = "topnavmobile";
  }
}



/**
Responsive HTML Table With Pure CSS - Web Design/UI Design

Code written by:
👨🏻‍⚕️ @Coding Design (Jeet Saru)

> You can do whatever you want with the code. However if you love my content, you can **SUBSCRIBED** my YouTube Channel.

🌎link: www.youtube.com/codingdesign 
*/

const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th'),
    seriesDropdown = document.querySelector('#seriesDropdown'),
    audioCheckbox = document.querySelector('#audioAvailableCheckbox'),
    videoCheckbox = document.querySelector('#videoAvailableCheckbox');

// 1. Searching for specific data of HTML table
if (search) search.addEventListener('input', filterTable);

if (audioCheckbox) audioCheckbox.addEventListener('change', filterTable);

if (videoCheckbox) videoCheckbox.addEventListener('change', filterTable);

function filterTable() {
    const search_data = search ? search.value.toLowerCase() : '';
    const selectedSeries = seriesDropdown ? seriesDropdown.value : '';
    const requireAudio = audioCheckbox ? audioCheckbox.checked : false;
    const requireVideo = videoCheckbox ? videoCheckbox.checked : false;
    let visibleCount = 0;

    table_rows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        const seriesCell = row.querySelectorAll('td')[1];
        const series = seriesCell ? seriesCell.textContent.trim() : '';
        const audioCell = row.querySelectorAll('td')[2];
        const videoCell = row.querySelectorAll('td')[3];
        const audioImg = audioCell ? audioCell.querySelector('img') : null;
        const videoImg = videoCell ? videoCell.querySelector('img') : null;
        const hasAudio = audioImg ? /audio available/i.test(audioImg.alt || '') : false;
        const hasVideo = videoImg ? /video available/i.test(videoImg.alt || '') : false;

        const matchesSearch = !search_data || rowText.indexOf(search_data) !== -1;
        const matchesSeries = !selectedSeries || series === selectedSeries;
        const matchesAudio = !requireAudio || hasAudio;
        const matchesVideo = !requireVideo || hasVideo;
        const shouldShow = matchesSearch && matchesSeries && matchesAudio && matchesVideo;

        row.classList.toggle('hide', !shouldShow);
        if (shouldShow) {
            row.style.setProperty('--delay', (visibleCount++) / 25 + 's');
        }
    });

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

// 1.5 Series Filter Dropdown

if (seriesDropdown) {
    // Populate series filter options
    const uniqueSeries = new Set();
    table_rows.forEach(row => {
        const seriesCell = row.querySelectorAll('td')[1];
        if (seriesCell) {
            const series = seriesCell.textContent.trim();
            if (series) uniqueSeries.add(series);
        }
    });

    // Sort and add to dropdown
    Array.from(uniqueSeries).sort().forEach(series => {
        const option = document.createElement('option');
        option.value = series;
        option.textContent = series;
        seriesDropdown.appendChild(option);
    });

    // Handle series filter change
    seriesDropdown.addEventListener('change', filterTable);
}


table_headings.forEach((head, i) => {
    let sort_asc = true;

    // only enable sorting on the fifth column
    if (i !== 4) return;

    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            const cell = row.querySelectorAll('td')[i];
            if (cell) cell.classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})


function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        const first_text = a.querySelectorAll('td')[column]?.textContent.toLowerCase().trim() || '',
            second_text = b.querySelectorAll('td')[column]?.textContent.toLowerCase().trim() || '';

        const first_value = getSortValue(first_text),
            second_value = getSortValue(second_text);

        if (first_value > second_value) return sort_asc ? -1 : 1;
        if (first_value < second_value) return sort_asc ? 1 : -1;
        return 0;
    })
    .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
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

    // Handle common date formats like "2024-04-01", "01/04/2024", "01-04-2024", "Apr 01 2024", "April 1, 2024"
    const numericDashes = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (numericDashes) {
        let [ , part1, part2, part3 ] = numericDashes;
        if (part3.length === 2) part3 = '20' + part3;
        // Assume day/month/year format for slash/dash separated dates
        value = `${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
    }

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? NaN : parsed;
}


//random button functionality
const random_btn = document.querySelector('#randomItem');
const customers_table = document.querySelector('#customers_table');
let previousRandomRow = null;

random_btn.onclick = () => {
    pickRandomItem(customers_table);
}

function pickRandomItem(table) {
    const visible_rows = [...table.querySelectorAll('tbody tr:not(.hide)')];
    if (!visible_rows.length) {
        return;
    }

    // Filter out the previously selected row
    const available_rows = visible_rows.filter(row => row !== previousRandomRow);
    
    if (!available_rows.length) {
        previousRandomRow = null;
        return pickRandomItem(table);
    }

    // Clear highlight from all rows
    visible_rows.forEach(row => {
        row.classList.remove('selected-row');
        row.style.backgroundColor = '';
    });

    const random_row = available_rows[Math.floor(Math.random() * available_rows.length)];
    previousRandomRow = random_row;
    random_row.classList.add('selected-row');
    random_row.style.backgroundColor = 'rgba(255, 111, 0, 0.12)';
    random_row.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const cells = random_row.querySelectorAll('td');
    const customer = cells[0].textContent.trim();
    const location = cells[1].textContent.trim();
    const orderDate = cells[2].textContent.trim();

    // alert(`Random item selected:\nCustomer: ${customer}\nLocation: ${location}\nOrder Date: ${orderDate}`);
}

// Initialize default sort - sort date column (column 4) in ascending order (oldest first)
document.addEventListener('DOMContentLoaded', () => {
    const dateHeader = table_headings[4];
    if (dateHeader) {
        dateHeader.classList.add('active');
        document.querySelectorAll('tbody tr').forEach((row) => {
            const cell = row.querySelectorAll('td')[4];
            if (cell) cell.classList.add('active');
        });
        sortTable(4, true); // true = ascending order (oldest first)
    }
});
