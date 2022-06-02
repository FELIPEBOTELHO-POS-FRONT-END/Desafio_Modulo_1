const apiPosts = axios.create({
  baseURL: "https://api.covid19api.com/",
});

export async function getSummaryData() {
  let res = await apiPosts.get("summary");
  return res.data;
}

export async function getCountries() {
  let res = await apiPosts.get("countries");
  return res.data;
}

export async function getStatusByCountryAndDate(country, startDate, endDate) {
  try {
    let res = await apiPosts.get(
      `/country/${country}?from=${startDate}T00:00:00.000Z&to=${endDate}T00:00:00.000Z`
    );
    return res.data ?? false;
  } catch {
    return false;
  }
}
