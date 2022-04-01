import moment from "moment";
import autoComplete from "@tarekraafat/autocomplete.js";

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
  },
  /**
   * 
   * @param {string} name 
   */
  autocomplete: function(name) {
    return `
    const autoCompleteJS_` + name + ` = new autoComplete({
      placeHolder: "Tippen sie...",
        selector: "#` + name.toLowerCase() + `",
        data: { 
            src: ["Eins", "Zwei"],
            cache: true, 
        },
        threshold: 2,
        debounce: 100,
        resultsList: {
            class: "autocomplete_results",
            maxResults: 5,
        },
        resultItem: {
            highlight: true,
        },
        events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    autoCompleteJS_` + name + `.input.value = selection;
                }
            }
        }
    });
    `
  }
};