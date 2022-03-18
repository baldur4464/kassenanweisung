import moment from "moment"

export default {
    formatdate: function (date) {
        return moment(date).format('yyyy-MM-DD');
    },
    selected: function (Zahlungsart, option) {
        return Zahlungsart == option;
    },
    nextpage: function (page) {
        return parseInt(page) + 1;
    },
    prevpage: function (page) {
        return parseInt(page) - 1;
    },
    selectfilter: function(filter) {

    }
}