import { getSummaryData } from "../js/api.js";

init();

async function init() {
  await generateGlobalDataChart();
}

async function generateGlobalDataChart() {
  const data = await getSummaryData();
  const confirmedDiv = document.getElementById("confirmed");
  const deathDiv = document.getElementById("death");
  const recoveredDiv = document.getElementById("recovered");
  const dateDiv = document.querySelector("#date > span");
  confirmedDiv.textContent = (data.Global.TotalConfirmed).toLocaleString();
  deathDiv.textContent = (data.Global.TotalDeaths).toLocaleString();
  recoveredDiv.textContent = (data.Global.TotalRecovered).toLocaleString();
  dateDiv.textContent= new Date(data.Global.Date).toLocaleString();
  
}

