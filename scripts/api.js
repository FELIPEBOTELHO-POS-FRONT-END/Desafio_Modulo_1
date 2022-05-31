const apiPosts = axios.create({
  baseURL: "https://api.covid19api.com/",
});

export async function getSummaryData() {
  let res = await apiPosts.get("summary");
  return res.data;
}
