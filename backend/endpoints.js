import fetch from "node-fetch"

export async function GetKassenpruefungen() {
  let url = "http://" + process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + "/kassenpruefungen/";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      },
    });
    if (response.status !== 200) {
      console.log("Error: Status was not 200 but " + response.status)
    }
    let obj = await response.json();
    let returnObj = []
    obj.forEach(element => {
      returnObj.push({
        Id: element.Id,
        Datum: element.Datum,
        Betrag: element.Betrag,
        Kasse: element.Geldanlagename,
        KassenId: element.GeldanlageId,
      });
    });
    return returnObj;
  } catch (e) {
    console.log(e)
  }
  return undefined
}