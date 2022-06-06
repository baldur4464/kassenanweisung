import fetch from "node-fetch"
import {Blob} from "buffer"


export async function GetKassenpruefungen() {
  let path = "/kassenpruefungen/";
  let obj = await sendGetRequestJSON(path)
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

/**
 * 
 * @param {number} id The numerical Id of the kassenpruefung
 * @returns {Promise<{Id: number, Datum: string, Betrag: number, GeldanlageId: number, Geldanlagename: string,}>}
 */
export async function GetKassenpruefung(id) {
  let path = "/kassenpruefungen/" + id;
  let obj = await sendGetRequestJSON(path)
  if (obj === undefined) {
    return obj;
  }
  return {
    Id: obj.Id,
    Datum: obj.Datum,
    Betrag: obj.Betrag,

  }
}

/**
 * GetKassenanweisungPDF requests a PDF File with a filled out form for the ID from the backend and sends the file to the user.
 * 
 * @param {number} id 
 * @returns {Promise<globalThis.Blob>} A PDF Form containing the information or undefined if nothing was sent
 */
export async function GetKassenanweisungPDF(id) {
  let path = "/kassenanweisungen/"+id;
  let obj = await sendGetRequestPDF(path)
  // convert to file?
  return obj
}

export async function GetAllInhabers() {
  let path = "/inhaber/";
  let obj = sendGetRequestJSON(path)
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

/**
 * GetJahresabschlussPDF schickt einen Request an das Backend los, welches den Jahresabschluss als PDF zurück sendet.
 * Zurück kommt dann ein Blob, welches dann mit res.type(blob.type) und res.send(Buffer.from(await blob.arrayBuffer())) zurück gesendet werden kann.
 * @param {number | string} anlageId Die AnlageId
 * @param {string} hhj Das Haushaltsjahr
 * @returns {Promise<globalThis.Blob>}
 */
export async function GetJahresabschlussPDF(anlageId, hhj) {
  const path = "/jahresabschluss/"+anlageId+"/download?haushaltsjahr="+hhj
  return await sendGetRequestPDF(path)
}


/**
 * 
 * @param {number | string} anlageId 
 * @param {string} hhj 
 * @returns {Promise<globalThis.Blob>}
 */
export async function GetJahresabschlussZIP(anlageId, hhj) {
  const path = "/jahresabschluss/"+anlageId+"/download?haushaltsjahr="+hhj
  return await sendGetRequestZIP(path)
}

/**
 * 
 * @param {string} anlageId 
 * @param {string} hhj 
 * @returns {Promise<{
 *  Fehlermeldungen: string[],
 *  Inhaber: string,
 *  Haushaltsjahr: string,
 *  Geldanlage: {Id: number, Name: string, Konto: boolean, IBan: string, InhaberId: number, Bank: string, BIC: string,},
 *  Anfangsbetrag: number,
 *  Endbetrag: number,
 *  Einnahmen: number,
 *  Ausgaben: number,
 *  Kassenpruefungen: {Id: number, Datum: string, Betrag: number, Geldanlage: number,}[],
 *  Kassenstaende: {Sammeldatum: string, Kassenstand_beginn: number, Kassenstand_ende: number, Fehlerwert: number, Kassenanweisungen: {Id: number, Haushaltsjahr: string, Titelnr: number, Begruendung: string, Betrag: number, Zahlungsart: string, Beleg: string, Ausstellungsdatum: string, Zahlungsdatum: string, Geldanlage_Geldempfaenger: number, Geldanlage_Geldgeber: number,}[]}[],
 * }>}
 */
export async function GetJahresabschlussJSON(anlageId, hhj) {
  const path = "/jahresabschluss/"+anlageId+"?haushaltsjahr="+hhj
  return await sendGetRequestJSON(path)
}

/**
 * 
 * @param {{Id: number, Datum: string, Betrag: number, GeldanlageId: number, Geldanlagename: string,}} kp 
 * @returns {Promise<number>} The status Code resulting from the request
 */
export async function UpdateKassenpruefung(kp) {
  const {Id, kp_no_Id} = kp
  let res = await sendPostOrPutJSON("/kassenpruefungen/" + Id, kp_no_Id, "PUT");
  return res
}

/**
 * 
 * @param {{Datum: string, Betrag: number, GeldanlageId: number, Geldanlagename: string,}} kp 
 * @returns {Promise<number>} The status Code resulting from the request
 */
export async function CreateKassenpruefung(kp) {
  let res = await sendPostOrPutJSON("kassenpruefungen/", kp, "POST");
  return res
}

export async function DeleteKassenpruefung(kp) {
  return await sendDelete("kassenpruefungen/"+kp.Id)
}

async function sendGetRequestJSON(path) {
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

async function sendPostOrPutJSON(path, jsonObject, method) {
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

async function sendGetRequestPDF(path) {
  let url = "http://"+process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + path;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Accept': "application/pdf"
      },
    });
    if (response.status !== 200) {
      console.log("Error: Status was not 200 but " + response.status);
    }
    const obj = await response.blob()
    return obj
  } catch (e) {
    console.log(e);
  }
  return undefined;
}

async function sendGetRequestZIP(path) {
  let url = "http://"+process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + path;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Accept': "application/zip"
      },
    });
    if (response.status !== 200) {
      console.log("Error: Status was not 200 but " + response.status);
    }
    const obj = await response.blob()
    return obj
  } catch (e) {
    console.log(e);
  }
  return undefined;
}

async function sendDelete(path) {
  let url = "http://"+process.env.BACKEND_HOST + ":" + process.env.BACKEND_PORT + path;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return response.status;
  } catch (e) {
    console.log(e);
  }
  return 400;
}