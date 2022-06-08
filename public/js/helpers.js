import moment from "moment";

export default {
  formatdate: function(date) {
    return moment(date).format("yyyy-MM-DD");
  },
  selected: function(value, option) {
    return value == option;
  },
  nextpage: function(page) {
    return parseInt(page) + 1;
  },
  prevpage: function(page) {
    return parseInt(page) - 1;
  },
  oneOf: function(options, value) {
    let optarr = options.split(",");
    let res = optarr.find((opt) => {
      return opt.trim() === value
    });
    return res !== undefined
  },
  filterTrue: function(filter) {
    if (filter != null && filter != "") {
      return true
    } else {
      return false
    }
  },
  limitTrue: function(limit) {
    if (limit != null && limit != 0) {
      return true
    } else {
      return false
    }
  },
  /**
   * 
   * @param {string} text 
   * @returns {string}
   */
  createJahresabschlussPath: function(text) {
    return "/jahresabschluss/"+encodeURIComponent(text);
  },
  stringEquals: function(value1, value2) {
    return value1 === value2;
  },
};