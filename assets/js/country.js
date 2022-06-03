import { getCountries, getStatusByCountryAndDate } from "../js/api.js";

init();
let LineChart;

async function init() {
  await generateCountriesCombo();
  const btnFilter = document.getElementById("filtro");
  btnFilter.addEventListener("click", async () => filter());
}

async function generateCountriesCombo() {
  const countries = await getCountries();
  const orderedCountries = _.orderBy(countries, "Country", "asc");
  const cmbCountry = document.getElementById("cmbCountry");
  _.map(orderedCountries, (country) => {
    let option = document.createElement("option");
    option.value = country.Slug;
    option.textContent = country.Country;
    if (country.Country == "Brazil") {
      option.selected = true;
    }
    cmbCountry.appendChild(option);
  });
  console.log(countries);
}

async function filter() {
  const startDate = document.getElementById("date_start").value;
  const endDate = document.getElementById("date_end").value;
  const country = document.getElementById("cmbCountry").value;
  const dataType = document.getElementById("cmbData").value;

  if (!startDate || !endDate || !country || !dataType) {
    alert("Please, fill all fields!");
    return;
  }
  const ISOStringStartDate = new Date(startDate).toISOString();
  //Get one day befora, to calcule de day status
  let dayBeforeStart = dateFns.format(
    dateFns.addDays(startDate, -1),
    "YYYY-MM-DD"
  );

  let allStatus = await getStatusByCountryAndDate(
    country,
    dayBeforeStart,
    endDate
  );

  //BUSCAR 1 DIA ANTES PARA OBTER NUMEROS DO DIA 0
  if (!allStatus) {
    alert("Please, use a week date range for this country");
    return;
  }
  console.log(
    dateFns.differenceInCalendarDays(ISOStringStartDate, allStatus[0].Date)
  );

  let dailyData = _.map(allStatus, (data, index) => {
    const obj = {
      ...data,
      DailyDeaths:
        index == 0 ? data.Deaths : data.Deaths - allStatus[index - 1].Deaths,
      DailyRecovered:
        index == 0
          ? data.recovered
          : data.Recovered - allStatus[index - 1].Recovered,
      DailyConfirmed:
        index == 0
          ? data.Confirmed
          : data.Confirmed - allStatus[index - 1].Confirmed,
    };
    return obj;
  });

  if (
    dateFns.differenceInCalendarDays(ISOStringStartDate, dailyData[0].Date) > 0
  ) {
    dailyData = dailyData.slice(1);
  }

  generateChart(dailyData, dataType);
  generateKpisData(dailyData);
}

function generateChart(data, dataType) {
  const select = document.getElementById("cmbCountry");
  const country = select[select.selectedIndex].textContent;
  console.log(data);
  if (LineChart) {
    LineChart.destroy();
  }
  const AvgDataType = _.meanBy(data, `Daily${dataType}`);
  const title =
    dataType == "Confirmed"
      ? "Confirmados"
      : dataType == "Deaths"
      ? "Mortes"
      : "Recuperados";

  LineChart = new Chart(document.getElementById("linhas"), {
    type: "line",
    data: {
      labels: _.map(data, (item) =>
        dateFns.format(item.Date.split("T")[0], "DD/MM/YYYY")
      ),
      datasets: [
        {
          data: _.map(data, (item) => Math.abs(item[`Daily${dataType}`])),
          label: `Número de ${title}`,
          borderColor: "red",
          backgroundColor: "red",
        },
        {
          data: _.map(data, () => AvgDataType),
          label: `Média de ${title}`,
          borderColor: "orange",
          backgroundColor: "orange",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          color: "#fff",
          display: true,
          title: {
            color: "#fff",
          },
          position: "left", //top, bottom, left, rigth
          labels: {
            color: "#fff",
          },
        },
        title: {
          display: true,
          color: "#fff",
          text: `Curva da COVID-19 (${country})`,
          font: {
            size: 25,
          },
        },
        layout: {
          padding: {
            left: 100,
            right: 100,
            top: 50,
            bottom: 10,
          },
        },
      },
    },
  });
}
function generateKpisData(data) {
  const divkpiconfirmed = document.getElementById("kpiconfirmed");
  const divkpideaths = document.getElementById("kpideaths");
  const divkpirecovered = document.getElementById("kpirecovered");

  divkpideaths.textContent = _.last(data).Deaths.toLocaleString();
  divkpiconfirmed.textContent = _.last(data).Confirmed.toLocaleString();
  divkpirecovered.textContent = _.last(data).Recovered.toLocaleString();
}
