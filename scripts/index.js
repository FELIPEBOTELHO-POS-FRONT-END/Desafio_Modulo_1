import { getSummaryData } from "../scripts/api.js";

init();

async function init() {
  await generateGlobalDataChart();
}

async function generateGlobalDataChart() {
  const data = await getSummaryData();
  const globalDataBox = generateDataBox(data.Global);
  const section = document.getElementById("global_data_box");
  section.innerHTML = globalDataBox;
}

function generateDataBox(data) {
  const DIV = ` 
        <div class="total_data_box">
          <strong>Total Confirmados</strong><br />
          <span>${data.TotalConfirmed.toLocaleString()}</span><br />
        </div>
        <div class="total_data_box">
          <strong>Total Mortes</strong><br />
          <span>${data.TotalDeaths.toLocaleString()}</span><br />
        </div>
        <div class="total_data_box">
          <strong>Total Recuperados</strong><br />
          <span>${data.TotalRecovered.toLocaleString()}</span><br />
        </div>
        <div class="total_chart_date">Atualizado em: ${new Date(
          data.Date
        ).toLocaleString()}</div>
      `;
  return DIV;
}
