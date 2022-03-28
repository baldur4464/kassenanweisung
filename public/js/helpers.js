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
      console.log("filter is true")
      return true
    } else {
      console.log("filter is false")
      return false
    }
  }
};