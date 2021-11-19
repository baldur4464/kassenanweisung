import express from "express";
import pdfFiller from "pdffiller";
import moment from "moment";
import dotenv from "dotenv";
import {numToWord} from "num-words-de";

dotenv.config();

function kassenanweisungdownload (req, res) {

    numberToWord(1025.53);

    res.render('kawedownload');
}

function kassenanweisungToPDF (Kassenanweisungen) {

    var sourcePDF = "/public/Kassenanordnung_2020_2021.pdf";
    var destinationPDF = "/test.pdf";
}

function getFilledKwobject (kassenanweisung) {

    var kwobject = {
        Haushaltsjahr: '',
        'Titel-Nr.': '',
        'in Worten': '',
        Kreditinstitut: '',
        BIC: '',
        IBAN: '',
        Rechnung_CB: '',
        'Überweisungsbeleg_CB': '',
        Quittung_CB: '',
        Ort_Datum_AStAMitglied: '',
        Ort_Datum_Finanzreferentin: '',
        AStAMitgliedUnterschrift: '',
        FinanzreferentinUnterschrift: '',
        'Buchführungstitel': '',
        'Buchführungsdatum': '',
        Gebucht_am: '',
        Ort_Datum_Buchhalterin: '',
        BuchhalterinUnterschrift: '',
        Kassenverwaltung_am: '',
        'Kassenverwaltung IBAN': '',
        AuszugNr: '',
        Barkasse_CB: '',
        Sonstiges_Konto_Kontonr: '',
        Sonstiges_Konto_AuszugNr: '',
        QuittungNr: '',
        Ort_Datum_Kassenverwaltung: '',
        KassenverwalterinUnterschrift: '',
        Betrag: '',
        'Einzahler Empfänger 1': '',
        'Einzahler Empfänger 2': '',
        'Buchführung Bemerkungen': '',
        'Buchführung Bemerkungen 2': '',
        'Kassenverwaltung Bemerkungen 1': '',
        'Begründung 1': '',
        'Begründung 2': '',
        Kassenverwaltung_IBAN_CB: '',
        Sonstiges_Konto_Nr_CB: '',
        'Art der *nahme': ''
    };

    kwobject.Haushaltsjahr = kassenanweisung.Haushaltsjahr;
    kwobject.Betrag = kassenanweisung.Betrag;
    kwobject["Titel-Nr."] = kassenanweisung.Titelnr;
    kwobject["Einzahler Empfänger 1"] = kassenanweisung.Geldempfänger;
    kwobject["Begründung 1"] = kassenanweisung.Begründung;
    kwobject.Kassenverwaltung_am = moment(kassenanweisung.Zahlungsdatum).format("DD.MM.yyyy");
    kwobject.Ort_Datum_Finanzreferentin = "Köln, " + moment(new Date()).format('DD.MM.yyyy');
    kwobject["in Worten"] = numberToWord(kassenanweisung.Betrag);

    if(kassenanweisung.Geldempfänger != "Fachschaft ET") {
        kwobject["Art der *nahme"] = "Ausgabe";
    } else {
        kwobject["Art der *nahme"] = "Einnahme";
    };

    if(kassenanweisung.Zahlungsart == "Überweisung") {
        kwobject.Kassenverwaltung_IBAN_CB = "On";
        kwobject["Kassenverwaltung IBAN"] = process.env.KASSENVERWALTUNG_IBAN;
    } else {
        kwobject.Barkasse_CB = "On";
    }

    if(kwobject["Art der *nahme"] == "Ausgabe" && kassenanweisung.Zahlungsart == "Überweisung") {
        kwobject.IBAN = process.env.KASSENVERWALTUNG_IBAN;
        kwobject.Kreditinstitut = process.env.KASSENVERWALTUNG_KREDITINSTITUT;
        kwobject.BIC = process.env.KASSENVERWALTUNG_BIC;
    }

    var belege = kassenanweisung.Beleg.split(", ");

    for (let belegeKey in belege) {
        switch (belegeKey) {
            case "Rechnung":
                kwobject.Rechnung_CB = "On";
                break;
            case "Überweisungsbeleg":
                kwobject.Überweisungsbeleg_CB = "On";
                break;
            case "Quittung":
                kwobject.Quittung_CB = "On";
                break;
            default:
                break;
        }
    }




    return kwobject;

}

function numberToWord (betrag) {
    var euro = parseInt(betrag);
    var cent = Math.ceil((betrag-parseInt(betrag))*100);


    var numword = ""+numToWord(euro)+" "+numToWord(cent);
    console.log(numword);
    return numword;
}

export {kassenanweisungToPDF, kassenanweisungdownload}