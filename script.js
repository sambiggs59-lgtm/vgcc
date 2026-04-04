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
    table_headings = document.querySelectorAll('thead th');

// 1. Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 25 + 's');
    })

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}

// 2. Sorting | Ordering data of HTML table

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

    visible_rows.forEach(row => row.classList.remove('selected-row'));

    const random_row = available_rows[Math.floor(Math.random() * available_rows.length)];
    previousRandomRow = random_row;
    random_row.classList.add('selected-row');
    random_row.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const cells = random_row.querySelectorAll('td');
    const customer = cells[0].textContent.trim();
    const location = cells[1].textContent.trim();
    const orderDate = cells[2].textContent.trim();

    // alert(`Random item selected:\nCustomer: ${customer}\nLocation: ${location}\nOrder Date: ${orderDate}`);
}
