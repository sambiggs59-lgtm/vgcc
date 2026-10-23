(() => {
const columnLabels = {
  "What is your Discord username?": "Discord username",
  "What would you rate the game out of 5?": "Rating (out of 5)",
  "Can you give a one-line summary of what you thought of the game?": "Review",
  "What platform did you play the game on?": "Platform",
  "On average how long did it take you to complete the game (if you completed it)": "Completion time"
};

function generateTable(data) {
  const table = document.createElement("table");
  const keys = Object.keys(data[0]);
  const header = table.createTHead().insertRow();
  const body = table.createTBody();

  keys.forEach(key => {
    const heading = document.createElement("th");
    heading.scope = "col";
    heading.textContent = columnLabels[key] || key;
    header.appendChild(heading);
  });

  data.forEach(item => {
    const row = body.insertRow();
    keys.forEach(key => {
      row.insertCell().textContent = item[key] ?? "";
    });
  });

  return table;
}

async function renderTable() {
  const script = document.currentScript;
  const container = document.getElementById(script?.dataset.target || "table-container");
  const source = script?.dataset.source;

  if (!container || !source) return;

  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      container.textContent = "No data available.";
      return;
    }

    container.replaceChildren(generateTable(data));
  } catch (error) {
    console.error("Unable to load table data:", error);
    container.textContent = "Table data could not be loaded.";
  }
}

renderTable();
})();