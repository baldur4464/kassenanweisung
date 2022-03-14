export async function GetKassenanweisungsPDF(id) {
  let url = process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + "/kassenanweisungen/" + id;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': "application/pdf"
    },
  });
  if (response.status !== 200) {
    console.log("Error: Status was not 200 but " + response.status)
  }
  return response.body;
}