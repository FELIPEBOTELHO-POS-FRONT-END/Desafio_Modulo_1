import { getSummaryData } from "../js/api.js";

init();

async function init() {
  const data = await getSummaryData();
  generateGlobalDataChart(data.Global);
  generatePieChart(data.Global);
  generateBarChart(data)
  console.log(data);
}

function generateGlobalDataChart(data) {
  const confirmedDiv = document.getElementById("confirmed");
  const deathDiv = document.getElementById("death");
  const recoveredDiv = document.getElementById("recovered");
  const dateDiv = document.querySelector("#date > span");
  confirmedDiv.textContent = (data.TotalConfirmed).toLocaleString();
  deathDiv.textContent = (data.TotalDeaths).toLocaleString();
  recoveredDiv.textContent = (data.TotalRecovered).toLocaleString();
  dateDiv.textContent = new Date(data.Date).toLocaleString();
}

function generateBarChart(data) {
  const datas = data.Countries.sort((a, b) => a.TotalDeaths > b.TotalDeaths ? -1 : a.TotalDeaths < b.TotalDeaths ? 1 : 0).slice(0, 10);

  let bar = new Chart(document.getElementById("barras"), {
    type: 'bar',
    data: {
      labels: datas.map(x => x.Country),
      datasets: [
        {
          label: "Nº de Mortes",
          data: datas.map(x => x.TotalDeaths),
          backgroundColor: "purple"
        }
      ]
    },
    options: {
      reponsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: "Total de Mortes por País - Top 10",
          font: {
            size: 25
          }
        }
      }
    }
  });

}

function generatePieChart(data) {
  let pizza = new Chart(document.getElementById("pizza"), {
    type: 'pie',
    data: {
      labels: ["Recuperados", "Mortes", "Confirmados"],
      datasets: [{
        data: [data.NewRecovered, data.NewDeaths, data.NewConfirmed],
        backgroundColor: ["blue", "yellow", "red"]
      }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: "Distribuição de novos casos",
          font: {
            size: 25
          }
        }
      }
    }
  })
}


