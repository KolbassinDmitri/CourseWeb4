(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://davids-restaurant.herokuapp.com/categories.json";

// Convenience function for inserting innerHTML
function insertHtml(selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
}

// Show loading icon
function showLoading(selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
}

// Return substitute of '{{propName}}'
function insertProperty(string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(propToReplace, propValue);
  return string;
}

// On page load
document.addEventListener("DOMContentLoaded", function () {
  showLoading("#main-content");
  loadHomePage();
});

// Load home page
function loadHomePage() {
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );
}

// Build home page with random category
function buildAndShowHomeHTML(categories) {

  var randomCategory = chooseRandomCategory(categories);

  var randomCategoryShortName =
    "'" + randomCategory.short_name + "'";

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var homeHtmlToInsertIntoPage =
        insertProperty(homeHtml,
          "randomCategoryShortName",
          randomCategoryShortName);

      insertHtml("#main-content",
        homeHtmlToInsertIntoPage);
    },
    false
  );
}

// Choose random category
function chooseRandomCategory(categories) {
  var randomIndex =
    Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

// Load menu items
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    "https://davids-restaurant.herokuapp.com/menu_items.json?category=" + categoryShort,
    function (response) {
      insertHtml("#main-content",
        "<h2 class='text-center'>" + response.category.name + "</h2>");
    },
    true
  );
};

global.$dc = dc;

})(window);
