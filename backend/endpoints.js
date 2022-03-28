import fetch from "node-fetch"

export async function GetKassenpruefungen() {
  let path = "/kassenpruefungen/";
  let obj = await sendGetRequest(path)
  if (obj === undefined) {
    return obj
  }
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
  return returnObj
}

export async function GetKassenpruefung(id) {
  let path = "/kassenpruefungen/" + id;
  let obj = await sendGetRequest(path)
  if (obj === undefined) {
    return obj;
  }
  return {
    Id: obj.Id,
    Datum: obj.Datum,
    Betrag: obj.Betrag,
  }
}

export async function GetAllInhabers() {
  let path = "/inhaber/";
  let obj = sendGetRequest(path)
  if (obj === undefined) {
    return obj
  }
  let returnObj = []
  obj.forEach(element => {
    returnObj.push({
      Id: element.Id,
      Name: element.Name,
    });
  });
  return returnObj

}

export async function UpdateKassenpruefung(kp) {
  let res = await sendPostOrPut("/kassenpruefungen/" + kp.Id, kp, "PUT");
  return res
}

async function sendGetRequest(path) {
  let url = "http://" + process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + path;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Accept': "application/json"
      },
    });
    if (response.status !== 200) {
      console.log("Error: Status was not 200 but " + response.status);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
  return undefined;
}

async function sendPostOrPut(path, jsonObject, method) {
  let url = "http://" + process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + path;
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
      },
      body: jsonObject,
    });
    return response.status;
  } catch (e) {
    console.log(e);
  }
  return 400;
}