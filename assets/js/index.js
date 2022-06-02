import { getSummaryData } from "../js/api.js";

init();

async function init() {
  const data = await getSummaryData();
  generateGlobalDataChart(data.Global);
  generatePieChart(data.Global);
  generateBarChart(data);
  console.log(data);
}

function generateGlobalDataChart(data) {
  const confirmedDiv = document.getElementById("confirmed");
  const deathDiv = document.getElementById("death");
  const recoveredDiv = document.getElementById("recovered");
  const dateDiv = document.querySelector("#date > span");
  confirmedDiv.textContent = data.TotalConfirmed.toLocaleString();
  deathDiv.textContent = data.TotalDeaths.toLocaleString();
  recoveredDiv.textContent = data.TotalRecovered.toLocaleString();
  dateDiv.textContent = new Date(data.Date).toLocaleString();
}

function generateBarChart(data) {
  const allData = _.orderBy(data.Countries, ["TotalDeaths"], "desc");
  const datas = _.slice(allData, 0, 10);

  let bar = new Chart(document.getElementById("barras"), {
    type: "bar",
    data: {
      labels: _.map(datas, "Country"),
      datasets: [
        {
          label: "Nº de Mortes",
          data: _.map(datas, "TotalDeaths"),
          backgroundColor: "purple",
        },
      ],
    },
    options: {
      reponsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Total de Mortes por País - Top 10",
          font: {
            size: 25,
          },
        },
      },
    },
  });
}

function generatePieChart(data) {
  let pizza = new Chart(document.getElementById("pizza"), {
    type: "pie",
    data: {
      labels: ["Recuperados", "Mortes", "Confirmados"],
      datasets: [
        {
          data: [data.NewRecovered, data.NewDeaths, data.NewConfirmed],
          backgroundColor: ["blue", "yellow", "red"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Distribuição de novos casos",
          font: {
            size: 25,
          },
        },
      },
    },
  });
}
