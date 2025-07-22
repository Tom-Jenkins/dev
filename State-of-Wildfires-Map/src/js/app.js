// Import JS libraries
import { Modal } from "bootstrap";
import L from "leaflet";
import Choices from "choices.js";
import responsivePopup from "leaflet-responsive-popup";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";

// Import CSS
import "leaflet/dist/leaflet.css";
import "choices.js/public/assets/styles/choices.min.css";

// Import default data as JavaScript object
import { geojsonCountries } from "./CountriesSimplified";
// console.log(geojsonCountries);

// Create an array to store data
const geojsonArray = [geojsonCountries];

// Function to dynamically load additional data after initial load
function loadAdditionalData() {
  Promise.all([
    import("./Continental_BiomesSimplified.js"),
    import("./EcoregionsSimplified.js"),
    import("./GADM_UCDavis_L1Simplified.js"),
  ])
    .then(([module2, module3, module4]) => {
      // Continental biomes
      const geojsonBiomes = module2.geojsonBiomes;
      geojsonArray.push(geojsonBiomes);
      // Ecoregions
      const geojsonEcoregions = module3.geojsonEcoregions;
      geojsonArray.push(geojsonEcoregions);
      // GADM
      const geojsonGADM = module4.geojsonGADM;
      geojsonArray.push(geojsonGADM);
    })
    .catch((error) => {
      console.error("Error loading additional data:", error);
    });
}

// Load additional data after initial load
window.addEventListener("load", () => {
  loadAdditionalData();
});

// ------------------- //
// Initialise Select Input Programatically
// ------------------- //

// Render first selector options based on geojson names in array
// const layers = geojsonArray.map( arr => arr.name );
// for (let i = 0; i < layers.length; i++) {
//   const option = document.createElement("option");
//   option.value = layers[i];
//   option.textContent = layers[i];
//   document.getElementById("first-selector").appendChild(option);
//   if (layers[i] === "Countries") document.getElementById("first-selector").selectedIndex = i;
// };

// ------------------- //
// Initialise Leaflet Map
// ------------------- //

// Global options
// window.L_DISABLE_3D = true;

// Define custom projection using proj4leaflet
// import proj4 from "proj4";
import { Proj } from "proj4leaflet";

// Define the Robinson projection using Proj4
const robinsonProj =
  "+proj=robin +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

// Define a custom CRS for Robinson
const robinsonCRS = new L.Proj.CRS("EPSG:54030", robinsonProj, {
  origin: [-20037508.342789244, 20037508.342789244],
  // define zoom level array
  resolutions: [
    // 156543.033928041,
    // 110407.27494603075,
    // 78271.5169640205,
    55271.63772301539, 39135.75848201024, 27613.818861507695, 19567.87924100512,
    13875.859050753847, 9783.93962050256, 6891.954715377821, 4891.96981025128,
    3468.9773576889106, 1734.4886788444553, 867.2443394222277,
    433.6221697111138,
  ],
});

// Initialize the map
const map = L.map("map", {
  // crs: L.CRS.Simple,
  crs: robinsonCRS,
  center: [0, 0],
  zoom: 1, // set the initial zoom level
  maxZoom: 11,
  closeTooltipOnClick: false,
  // renderer: L.canvas(),
});

// Set map boundary [ymin, xmin, ymax, xmax]
// map.fitBounds([[-45, -130], [75, 130]]);

// Add no tiles to map
L.tileLayer("").addTo(map);

// ------------------- //
// Add Reset Map button
// ------------------- //

// Add a repeat arrow button to the top-left corner of the map
// [Detail: this code creates and adds a custom control using the leaflet library]
const resetView = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function () {
    const divContainer = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    divContainer.setAttribute("id", "btn-reset-view");
    divContainer.setAttribute("style", "cursor: pointer;");

    divContainer.insertAdjacentHTML(
      "afterbegin",
      `
        <a title="Reset view">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
          </svg>
        </a>
      
      `
    );
    document.getElementById("map").style.outlineStyle = "none";
    return divContainer;
  },
});
map.addControl(new resetView());

// Reset view to default view when button is clicked
document.getElementById("btn-reset-view").addEventListener("click", () => {
  // map.fitBounds([[-45, -130], [75, 130]]);
  map.setView([0, 0], 1);
});

// ------------------- //
// Add Download Data Button
// ------------------- //

// Download data button
// Add a repeat arrow button to the top-left corner of the map
const downloadData = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function () {
    const divContainer = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    divContainer.setAttribute("id", "btn-download-data");
    divContainer.setAttribute("style", "cursor: pointer;");

    divContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <a title="Download layer data">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
        </svg>
      </a>
    
    `
    );
    document.getElementById("map").style.outlineStyle = "none";
    return divContainer;
  },
});
map.addControl(new downloadData());

// ------------------- //
// Add Save Image Button
// ------------------- //

// Add a custom control button to the top-left corner of the map
const saveImageIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
  </svg>`;
const saveImage = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function () {
    const divContainer = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    divContainer.setAttribute("id", "btn-save-image");
    divContainer.setAttribute("style", "cursor: pointer;");

    divContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <a title="Download screenshot">
        ${saveImageIcon}
      </a>
    `
    );
    document.getElementById("map").style.outlineStyle = "none";
    return divContainer;
  },
});
map.addControl(new saveImage());

// Inititate screenshot on map with the default button hidden
const simpleMapScreenshoter = L.simpleMapScreenshoter({
  hidden: true,
  hideElementsWithSelectors: [
    ".leaflet-control-zoom",
    "#btn-reset-view",
    "#btn-info-modal",
    "#eu-toggle",
    "#btn-download-data",
  ],
}).addTo(map);

// Remove screenshoter logo entirely from DOM
document.querySelector(".leaflet-control-simpleMapScreenshoter").remove();

// Download an image when save-image button is clicked
document.getElementById("btn-save-image").addEventListener("click", () => {
  // first hide the btn-save-image
  document.querySelector("#btn-save-image").style.display = "none";

  // second change the display hover text in the display info element to none
  const displayInfoSpan = document.querySelector("#display-info-widget > span");
  if (displayInfoSpan) {
    displayInfoSpan.textContent = "Jones et al. 2024";
  }

  // add temporary title
  const tempTitle = L.control({ position: "topleft" });
  tempTitle.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "displayInfo"); // create div with class "displayInfo"
    this._div.setAttribute("id", "temp-title");
    this._div.innerHTML = `<h3 style="margin-bottom:0; font-size: 1.5em;">State of Wildfires: Extremes of 2024-2025 Fire Season</h3>`;
    this._div.style.position = "absolute";
    this._div.style.top = "1px"; // Distance from top of the map container
    this._div.style.left = "1px"; // Distance from left of the map container
    this._div.style.width = "max-content";
    return this._div;
  };
  tempTitle.addTo(map);

  // take screenshot
  simpleMapScreenshoter
    .takeScreen("blob", {
      // caption: function () {
      //     return "Caption"
      // },
    })
    .then((blob) => {
      saveAs(blob, "State-of_Wildfires-UEA-Map.png");

      // last unhide the btn-save-image
      document.querySelector("#btn-save-image").style.display = "block";
      // default text back on display info widget
      if (displayInfoSpan) {
        displayInfoSpan.textContent = "Hover over a polygon";
      }
      // remove temp title
      tempTitle.remove();
    })
    .catch((e) => {
      console.error(e.toString());
    });
});

// ------------------- //
// Add Information Modal Button
// ------------------- //

// Information modal button
// Add a info icon button to the top-left corner of the map
const infoModal = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function () {
    const divContainer = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    divContainer.setAttribute("id", "btn-info-modal");
    divContainer.setAttribute("style", "cursor: pointer;");

    divContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <a title="More information">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-info" viewBox="0 0 16 16">
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
        </svg>
      </a>
    `
    );

    // Add event listener to show the modal
    divContainer.addEventListener("click", () => {
      const infoModal = new Modal(document.getElementById("infoModal"));
      infoModal.show();
    });

    document.getElementById("map").style.outlineStyle = "none";
    return divContainer;
  },
});
map.addControl(new infoModal());

// ------------------- //
// Add Main Display Widget
// ------------------- //

// Add a custom control to display the region and value on the top-right of the map
const displayInfo = L.control();

// Function when element is added to map
displayInfo.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "displayInfo"); // create div with class "displayInfo"
  this._div.setAttribute("id", "display-info-widget");
  this.update();
  return this._div;
};

// Function when user hovers over polygons
displayInfo.update = function (property) {
  const element = document.getElementById("second-selector");
  const text = element.options[element.selectedIndex].text;
  const unit = "%";
  if (property) {
    this._div.innerHTML = `<h4>${text}</h4> <b>${property.reg_name}:
    ${
      property[element.value] !== null
        ? property[element.value] > 0
          ? `+${property[element.value]}`
          : property[element.value]
        : "Insufficient Data"
    }
    ${property[element.value] !== null ? unit : ""}</b>`;
  } else {
    this._div.innerHTML = `<h4>${text}</h4> <span>Hover over a polygon</span>`;
  }
};

// Add functionality to map
displayInfo.addTo(map);

// Add scalebar to the bottom-left corner of the map
// L.control.scale({imperial: false}).addTo(map);

// ------------------- //
// Add UEA Logo
// ------------------- //

// Add UEA logo to the bottom-right corner of the map
const ueaLogo = L.Control.extend({
  options: {
    position: "bottomright",
    // renderer: L.canvas(),
  },
  onAdd: function () {
    const divContainer = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    divContainer.setAttribute("id", "uea-logo");
    divContainer.setAttribute(
      "style",
      "border: none; pointer-events: none; width: 50px; height: 100%; background-color: white; padding: 2px; opacity: 0.80;"
    );

    divContainer.insertAdjacentHTML(
      "afterbegin",
      `

      <svg width="100%" height="100%" viewBox="0 0 1963 1184" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g><path d="M481.442,886.217c-10.679,-0 -3.421,-0.279 -13.421,-0.279c-123.821,-0 -216.754,-85.088 -216.754,-323.28l-0,-351.079c-0,-120.362 53.266,-166.041 128.541,-166.041l0,-14.321l-379.808,-0l0,14.146c66.008,1.27 89.863,57.379 89.863,131.166l-0,346.059c-0,260.729 124.825,378.454 351.108,378.454l40.437,-0l0.034,-14.825Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1244.58,644.079c-1.458,-130.675 -30.937,-158.783 -161.441,-160.05l-0,-12.916c130.504,-1.288 159.983,-29.325 161.441,-160.021l12.292,-0c1.513,130.696 30.921,158.646 161.425,159.916l0,13.021c-130.504,1.267 -159.912,29.375 -161.425,160.05l-12.292,0Z" style="fill:#00aeef;fill-rule:nonzero;"/><path d="M544.238,886.304c118.124,0 170.087,-80.192 170.087,-193.525c0,-135.766 0,0 0,0l-0.125,-492.866c0,-115.763 -57.983,-154.271 -128.313,-154.271l-0.054,-14.463l670.904,0l0.292,182.084l-11.891,-0.034c-20.034,-107.029 -61.771,-148.837 -197.9,-148.837l-31.542,-0c-128.021,-0 -153.179,40.816 -153.179,155.4l-0,106.562c-0,138.925 56.721,144.638 163.629,144.638l-0,13.021c-106.908,-0 -163.629,11.645 -163.629,151.924l-0,45.609c-0,171.858 21.683,183.279 166.112,183.279c85.379,-0 189.463,-21.875 216.217,-139.671l12.204,0.054l0,175.834l-712.812,-0l-0,-14.738Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1495.75,886.217c117.933,-0 147.725,-76.146 94.271,-195.609l-180.729,-451.979l52.22,-223.541l9.95,-0.038c0,0 248.525,590.104 310.175,709.5c65.05,126.004 119.721,161.754 173.646,161.754l0,14.738l-459.533,-0l-0,-14.825Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M138.158,1152.17c-31.129,-0 -49.737,-22.413 -49.737,-59.95l-0,-76.788l19.167,0l-0,75.817c-0,28.158 12.795,40.85 30.937,40.85c18.054,0 30.4,-12.342 30.4,-39.879l-0,-76.788l19.167,0l-0,75.625c-0,38.246 -18.667,61.113 -49.934,61.113Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M286.738,1149.12l-18.717,-0l-0,-59.621c-0,-16.858 -7.067,-25.796 -19.167,-25.796c-12.692,0 -22.692,10.138 -22.692,26.996l0,58.421l-18.679,-0l0,-102.363l17.588,0l-0,14.446c5.987,-11.062 15.45,-16.583 27.462,-16.583c20.767,-0 34.205,16.162 34.205,41.233l-0,63.267Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M329.217,1034.51l-18.438,-0l0,-18.921l18.438,-0l-0,18.921Zm0.158,114.604l-18.679,-0l-0,-102.363l18.679,0l0,102.363Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M396.546,1149.86l-16.513,-0.001l-36.683,-103.108l19.792,0l25.175,76.7l25.329,-76.7l19.446,0l-36.546,103.108Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M457.188,1089.69l47.516,-0.001c-1.612,-15.295 -9.392,-27.308 -23.404,-27.308c-13.313,0 -22.533,12.446 -24.113,27.308Zm26.092,61.755c-26.283,-0 -45.433,-22.971 -45.433,-53.421c-0,-30.45 19.012,-53.404 43.767,-53.404c24.758,-0 42.137,21.754 42.137,54.166c0,1.392 0,2.971 -0.175,5.334l-0.087,2.204l-66.18,-0c2.084,18.437 13.475,27.604 26.305,27.604c8.312,-0 17.254,-3.454 25,-12.829l0.745,-0.871l10.259,10.262l0.816,0.834l-0.712,0.954c-9.513,13.108 -21.509,19.167 -36.442,19.167Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M558.629,1149.12l-18.387,-0l-0,-102.363l17.954,0l-0,21.963c6.196,-15.904 17.15,-23.734 30.675,-23.734c0.537,0 2.587,0.071 2.587,0.071l0,21.996l-2.083,0c-16.858,0 -30.746,13.229 -30.746,41.004l0,41.063Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M632.013,1151.01c-11.371,0 -24.217,-4.637 -34.08,-13.891l-0.795,-0.709l8.399,-14.62l0.905,0.783c9.425,8.158 17.741,11.421 27.445,11.421c10.055,-0 15.955,-4.792 15.955,-12.621c-0,-8.196 -6.334,-11.108 -18.105,-14.913c-12.412,-4.062 -29.395,-9.966 -29.395,-31.233c-0,-17.95 14.691,-30.208 32.625,-30.208c10.658,-0 21.041,3.125 30.225,10.137l0.883,0.646l-7.583,15.363l-0.905,-0.713c-8.195,-6.129 -17.395,-8.421 -23.42,-8.421c-9.2,0 -14.721,4.879 -14.721,11.271c-0,8.071 5.121,10 20.362,14.721c16.771,5.208 27.067,14.846 27.067,31.425c-0,19.042 -14.375,31.562 -34.863,31.562Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M805.746,1180.55c-12.484,0 -24.342,-8.646 -24.342,-8.646l6.25,-17.187c0,-0 9.638,7.171 17.05,7.171c9.967,-0 14.517,-6.234 18.142,-16.65l-38.942,-98.488l20.246,0l27.742,73.125l22.708,-73.125l19.725,0l-36.912,104.842c-7.084,18.612 -17.43,28.958 -31.25,28.958" style="fill:#231f20;fill-rule:nonzero;"/><path d="M949.704,1062.9c-14.446,0 -27.604,13.142 -27.604,34.442c0,21.425 13.3,35.108 27.933,35.108c14.584,0 27.867,-13.179 27.867,-34.325c0,-19.496 -12.204,-35.192 -28.196,-35.192m0,88.213c-25.729,-0 -46.612,-23.317 -46.612,-53.021c-0,-30.346 21.025,-53.783 46.941,-53.783c25.817,-0 46.98,23.279 46.98,53c-0,30.316 -21.284,53.804 -47.309,53.804Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1034.36,1149.01l-18.975,0l0,-83.85l-11.895,0l-0,-18.508l11.895,0l0,-6.65c0,-24.967 19.2,-30.05 28.071,-30.05c6.684,0 11.079,1.196 14.584,2.621l0.729,0.292l-0,18.524l-0.938,-0.45c-2.741,-1.387 -7.466,-2.466 -10.591,-2.466c-9.375,-0 -13.055,5.262 -13.055,13.716l0,4.655l24.392,-0l0,18.316l-24.217,0l0,83.85Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1188.54,1148.96l-82.5,0l-0,-133.75l81.666,0l0,19.321l-62.204,0l0,34.759l54.688,-0l-0,19.308l-54.688,-0l0,41.229l63.038,0l-0,19.133Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1218.17,1117.28c0,10.571 7.675,16.042 17.642,16.042c15.779,-0 24.758,-11.425 24.758,-24.513l0,-5.591c-4.204,-2.534 -11.65,-4.325 -19.671,-4.325c-11.425,-0 -22.729,5.729 -22.729,18.387Zm15.108,33.504c-16.562,0 -34.045,-10.537 -34.045,-33.021c-0,-21.612 15.795,-36.229 39.67,-36.229c9.2,0 16.821,1.996 21.284,3.871l-0,-1.425c-0,-10.746 -5.488,-20.779 -20.4,-20.779c-10.696,-0 -20.834,3.871 -28.975,9.25l-1.042,0.696l-5.4,-17.588l0.883,-0.675c8.005,-5.242 21.234,-10.137 34.896,-10.137c12.329,-0 22.659,3.937 29.1,11.387c6.284,7.275 9.688,17.154 9.688,30.242l-0,62.587l-16.392,0l0,-12.966c-3.679,6.995 -14.458,14.787 -29.267,14.787Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1543.33,1095.87l-20.712,-52.654l-20.642,52.708l41.354,-0.054Zm40.675,53.091l-20.829,0l-12.658,-33.8l-55.659,0l-12.675,33.8l-20.591,0l53.7,-133.558l15.016,0l53.696,133.558Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1732.43,1063.17c-13.504,0 -25.121,10.558 -25.121,29.292c0,18.733 12.067,30.104 25.121,30.104c14.742,-0 27.379,-11.946 27.379,-29.533c0,-20.746 -13.8,-29.863 -27.379,-29.863Zm0.159,117.05c-14.825,0 -28.23,-4.737 -39.93,-14.133l-0.816,-0.659l8.071,-16.858l0.975,0.854c9.825,8.296 20.812,12.5 32.62,12.5c19.271,0 28.109,-13.458 28.109,-31.25l-0,-8.108c-5.942,12.567 -18.65,18.646 -31.671,18.646c-20.521,-0 -41.771,-17.938 -41.771,-47.954c0,-30.709 21.25,-48.784 41.771,-48.784c13.058,0 26.337,6.267 32.675,17.725l-0,-15.625l16.633,0l0,83.734c0,15.329 -3.854,27.516 -11.371,36.233c-7.762,8.942 -20.975,13.679 -35.295,13.679Z" style="fill:#231f20;fill-rule:nonzero;"/><rect x="1800.14" y="1015.49" width="18.679" height="133.471" style="fill:#231f20;"/><path d="M757.742,1150.95c-16.404,0 -26.404,-10.487 -26.404,-29.479l-0,-55.938l-12.034,0.001l0,-18.734l11.771,-0.016l-0.017,-28.35l19.063,-0l-0,28.404l25.296,-0l-0,18.696l-25.296,-0l-0,50.991c-0,9.634 3.212,15.329 11.321,15.329c4.271,0 8.437,-1.025 11.546,-2.85l1.562,-0.866l-0.071,18.058l-0.696,0.346c-4.979,3.004 -10.104,4.408 -16.041,4.408Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1408.56,1150.62c-16.441,0 -26.441,-10.487 -26.441,-29.446l-0,-55.954l-12.03,-0l0,-18.525l11.684,-0.017l-0.034,-28.591l19.151,-0l-0,28.416l25.291,0l0,18.717l-25.291,-0l-0,50.992c-0,9.6 3.225,15.291 11.354,15.291c4.271,0 8.416,-0.971 11.541,-2.829l1.563,-0.867l0.037,18.075l-0.816,0.346c-4.984,3.005 -10.105,4.392 -16.009,4.392Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1673.05,1149.03l-18.712,0l-0,-59.583c-0,-16.875 -7.067,-25.817 -19.167,-25.817c-12.708,0 -22.692,10.138 -22.692,26.979l0,58.421l-18.7,0l0,-102.346l17.588,0l-0,14.446c5.991,-11.079 15.471,-16.579 27.45,-16.579c20.796,0 34.233,16.163 34.233,41.229l0,63.25Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M703.263,1034.57l-18.455,-0l0,-18.925l18.455,-0l-0,18.925Zm0.174,114.791l-18.716,0l-0,-102.57l18.716,-0l0,102.57Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1859.42,1034.64l-18.471,-0l0,-18.942l18.471,-0l0,18.942Zm0.158,114.27l-18.679,0l0,-102.362l18.679,-0l0,102.362Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1325.68,1150.61c-11.391,0 -24.221,-4.67 -34.083,-13.908l-0.796,-0.708l8.4,-14.654l0.921,0.816c9.412,8.175 17.725,11.442 27.433,11.442c10.05,-0 15.971,-4.792 15.971,-12.625c0,-8.208 -6.354,-11.146 -18.142,-14.946c-12.395,-4.063 -29.375,-9.983 -29.375,-31.2c0,-17.967 14.671,-30.225 32.605,-30.225c10.691,0 21.041,3.108 30.241,10.138l0.867,0.662l-7.567,15.313l-0.904,-0.68c-8.212,-6.125 -17.396,-8.4 -23.437,-8.4c-9.2,0 -14.705,4.842 -14.705,11.25c0,8.071 5.121,9.984 20.363,14.705c16.754,5.208 27.067,14.858 27.067,31.458c-0,19.008 -14.392,31.562 -34.859,31.562Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1894.6,1117.69c0,10.591 7.692,16.025 17.638,16.025c15.783,-0 24.775,-11.409 24.775,-24.5l-0,-5.571c-4.2,-2.554 -11.646,-4.304 -19.688,-4.304c-11.387,-0 -22.725,5.691 -22.725,18.35Zm15.104,33.508c-16.546,-0 -34.046,-10.521 -34.046,-33.004c0,-21.617 15.85,-36.217 39.688,-36.217c9.166,0 16.825,1.963 21.287,3.871l0,-1.442c0,-10.746 -5.487,-20.779 -20.416,-20.779c-10.696,0 -20.834,3.871 -28.975,9.254l-1.063,0.675l-5.396,-17.587l0.9,-0.642c8.004,-5.279 21.234,-10.137 34.913,-10.137c12.312,-0 22.658,3.887 29.116,11.354c6.25,7.275 9.65,17.15 9.65,30.241l0,62.292l-16.387,0l-0,-12.654c-3.679,6.996 -14.463,14.775 -29.271,14.775Z" style="fill:#231f20;fill-rule:nonzero;"/></g>
      </svg>

    `
    );

    // document.getElementById("map").style.outlineStyle = "none";
    return divContainer;
  },
});
map.addControl(new ueaLogo());

// ------------------- //
// Leaflet Map Parameters
// ------------------- //

// Import functions from utils
import { colourPolygons, popupContent } from "./utils";

// Variable scales
// const scale = [-50, -25, -10, 0, 10, 25, 50, 100, 200];
const scale = [200, 100, 50, 25, 10, 0, -10, -25, -50];
const ba_anom_scale = scale;
const cem_emAn_scale = scale;
const gfa_nFAnP_scale = scale;
const gfa_95FAP_scale = scale;
const gfa_95RAP_scale = scale;
const frp_95dPc_scale = scale;
const scaleObj = {
  ba_anom: ba_anom_scale,
  cem_emAn: cem_emAn_scale,
  gfa_nFAnP: gfa_nFAnP_scale,
  gfa_95FAP: gfa_95FAP_scale,
  gfa_95RAP: gfa_95RAP_scale,
  frp_95dPc: frp_95dPc_scale,
};

// Colour palette
const colPalette = [
  "#a50026",
  "#f46d43",
  "#fdae61",
  "#fee090",
  "#ffffbf",
  "white",
  "#e0f3f8",
  "#abd9e9",
  "#74add1",
  "#4575b4",
];

// Function to style polygons
const stylePolygons = function (variable) {
  return function (feature) {
    return {
      fillColor: colourPolygons(
        feature.properties[variable],
        variable,
        scaleObj,
        colPalette
      ),
      weight: 0.5,
      opacity: 1,
      color: "black",
      dashArray: "1",
      fillOpacity: 1,
    };
  };
};

// Function to highlight polygon borders and show popup on mouseover (when mouse hovers over them)
const highlightPolygon = function (e) {
  const polygon = e.target;

  // Polygon borders
  polygon.setStyle({
    weight: 2,
    color: "black",
    fillOpacity: 1,
  });

  // Update display information in top-right box
  displayInfo.update(polygon.feature.properties);

  polygon.bringToFront();
};

// Functions to trigger white and black transition when a polygon is clicked
const triggerWhite = (e) => {
  e.target.setStyle({ color: "white" });
};
const triggerBlack = (e) => {
  e.target.setStyle({ color: "black" });
};

// Popup options
// https://leafletjs.com/reference.html#popup
const popupOptions = {
  className: "popupCustom", // must match a css class
  closeButton: true,
  autoPan: true,
};

// Function to show popup on mouse click
const showPopup = function (e) {
  const polygon = e.target;

  // Popup content
  const popupContentHtml = popupContent(polygon.feature.properties);

  // Create popup that stays within map boundary
  const popup = L.responsivePopup({ offset: [0, 0] }).setContent(
    popupContentHtml
  );

  // Bind the popup with unique content
  polygon.bindPopup(popup, popupOptions).openPopup();
};

// Function to reset border to original style on mouseout (when mouse is not hovering over a polygon)
const resetHighlight = function (e) {
  geojsonLayer.resetStyle(e.target);
  displayInfo.update();
};

// Function to add highlighting parameters to a layer
const onEachFeature = function (feature, layer) {
  layer.on({
    mouseover: highlightPolygon,
    mouseout: resetHighlight,
    click: showPopup,
    mousedown: triggerWhite,
    mouseup: triggerBlack,
  });
};

// ------------------- //
// Default Leaflet Map
// ------------------- //

// Function to find the active layer in the first selector
const activeLayer = function () {
  const firstSelectorValue = document.getElementById("first-selector").value;
  const activeLayerIndex = geojsonArray
    .map((arr) => arr.name)
    .indexOf(firstSelectorValue);
  const activeLayerData = geojsonArray[activeLayerIndex];
  return activeLayerData;
};
// console.log(activeLayer());

// Add default layer to map
let geojsonLayer = L.geoJson(activeLayer(), {
  style: stylePolygons("ba_anom"),
  onEachFeature: onEachFeature,
}).addTo(map);

// ------------------- //
// Leaflet Map Legend
// ------------------- //

// Inititate legend control
let legend = L.control({ position: "bottomleft" });

// Function when element is added to map
legend.onAdd = function (map) {
  const activeVariable = document.getElementById("second-selector").value;
  const unit = "%";
  // console.log(scaleObj[activeVariable])

  const div = L.DomUtil.create("div", "displayInfo legend"),
    grades = scaleObj[activeVariable],
    labels = scaleObj[activeVariable];

  // Legend title
  div.innerHTML += `
    <span id="legend-title">
      <h6 class="text-start legendTooltip" style="display: none;">% deviation from the average fire season</h6>
      <h6 class="text-start">
        Legend<br>
        <span>(${unit})</span>
      </h6>
    </span>
  `;

  for (let i = 0; i < grades.length - 1; i++) {
    div.innerHTML += `
      <i style="background:${colPalette[i]}"></i>
      <span class="legend-text">${
        grades[i] > 0 ? `+${grades[i]}` : grades[i]
      }</span>
      <br>
    `;
  }

  div.innerHTML += `
    <i style="background:${colPalette[grades.length]}"></i>
    <span class="legend-text">${grades[grades.length - 1]}</span>
  `;

  return div;
};

// Function to update the legend
const updateLegend = function () {
  const activeVariable = document.getElementById("second-selector").value;
  const unit = "%";
  const legend = document.querySelector(".displayInfo.legend.leaflet-control");

  // Clear the existing content of the legend
  legend.innerHTML = "";

  // Get the grades and labels for the active variable
  const grades = scaleObj[activeVariable];

  // Set the new legend content
  legend.innerHTML += `
    <span id="legend-title">
      <h6 class="text-start legendTooltip" style="display: none;">% deviation from the average fire season</h6>
      <h6 class="text-start">
        Legend<br>
        <span>(${unit})</span>
      </h6>
    </span>
  `;

  for (let i = 0; i < grades.length - 1; i++) {
    legend.innerHTML += `
      <i style="background:${colPalette[i]}"></i>
      <span class="legend-text">${
        grades[i] > 0 ? `+${grades[i]}` : grades[i]
      }</span>
      <br>
    `;
  }

  legend.innerHTML += `
    <i style="background:${colPalette[grades.length]}"></i>
    <span class="legend-text">${grades[grades.length - 1]}</span>
  `;
};

// Add legend to map
legend.addTo(map);
attachEventListeners();

// ------------------- //
// Event Listeners
// ------------------- //

// Change the data displayed when a different layer is selected
document.getElementById("first-selector").addEventListener("change", () => {
  // Remove active layer from map
  map.removeLayer(geojsonLayer);

  // Extract active second selector
  let activeVariable = document.getElementById("second-selector").value;

  // Add new layer to map
  geojsonLayer = L.geoJson(activeLayer(), {
    style: stylePolygons(activeVariable),
    onEachFeature: onEachFeature,
  }).addTo(map);
});

// Change the variable displayed when a different variable is selected
document.getElementById("second-selector").addEventListener("change", () => {
  // Remove active layer from map
  map.removeLayer(geojsonLayer);

  // Extract active second selector
  let activeVariable = document.getElementById("second-selector").value;

  // Add new layer to map
  geojsonLayer = L.geoJson(activeLayer(), {
    style: stylePolygons(activeVariable),
    onEachFeature: onEachFeature,
  }).addTo(map);

  // Update legend
  updateLegend();

  // Change title of displayInfo text content on top-right widget
  const activeVariableText =
    document.getElementById("second-selector").textContent;
  document.querySelector(".displayInfo > h4").textContent = activeVariableText;

  // Update tooltip event listeners
  attachEventListeners();
});

// Function to download data when download button is clicked
const exportCSV = function () {
  // 1. Prepare layer data for download
  let csv = "";
  let row = "";

  // Programmatically extract keys from the first object to use as headers
  const keys = Object.keys(activeLayer().features[0].properties);

  // Change order of keys
  const keysOrder = [
    "reg_layer",
    "reg_ID",
    "reg_name",
    "start_yr",
    "end_yr",
    "start_mo",
    "end_mo",
    "land_cov",
  ];

  // Filter out the keys items from the original array
  const remainingItems = keys.filter((item) => !keysOrder.includes(item));

  // Sort the remaining items alphabetically
  remainingItems.sort();

  // Concatenate the keys items with the sorted remaining items
  const keysHeader = keysOrder.concat(remainingItems);

  // Prepare array with new column names based on condition
  let newHeader = keysHeader.map((element) => {
    if (element === "reg_layer") return "Regional Layer";
    if (element === "reg_ID") return "Region ID";
    if (element === "reg_name") return "Region Name";
    if (element === "start_yr") return "Fire Season Start Year";
    if (element === "end_yr") return "Fire Season End Year";
    if (element === "start_mo") return "Fire Season Start Month";
    if (element === "end_mo") return "Fire Season End Month";
    if (element === "land_cov") return "Land Cover";
    if (element === "ba_anom")
      return "Burned Area Anomaly in 2023-24 Fire Season (%)";
    if (element === "ba_final")
      return "Burned Area in 2023-24 Fire Season (km^2)";
    if (element === "ba_mean") return "Burned Area Mean Annual (km^2)";
    if (element === "ba_moAf")
      return "Months After Peak with Above-Average Burned Area";
    if (element === "ba_moBf")
      return "Months Prior to Peak with Above-Average Burned Area";
    if (element === "ba_moPk") return "Month with Peak in Burned Area Anomaly";
    if (element === "ba_rank") return "Burned Area Rank in 2023-24 Fire Season";
    if (element === "cem_emAn")
      return "Carbon Emitted Anomaly in 2023-24 Fire Season (%)";
    if (element === "cem_emFl") return "Carbon Emitted in 2023-24 Fire Season";
    if (element === "cem_emMn") return "Carbon Emitted Mean Annual (kg)";
    if (element === "cem_emRk")
      return "Carbon Emitted Rank in 2023-24 Fire Season";
    if (element === "frp_95dPc")
      return "Average Fire's 95th Percentile FRP Anomaly (%)";
    if (element === "frp_95r")
      return "Average Fire's 95th Percentile FRP Rank (MW)";
    if (element === "cem_moAf")
      return "Months After Peak with Above-Average Carbon Emitted";
    if (element === "cem_moBf")
      return "Months Prior to Peak with Above-Average Carbon Emitted";
    if (element === "cem_moPk")
      return "Month with Peak in Carbon Emitted Anomaly";
    if (element === "gfa_95FAP")
      return "95th Percentile Fire Size Anomaly in 2023-24 Fire Season (%)";
    if (element === "gfa_95FRk")
      return "95th Percentile Fire Size Rank in 2023-24 Fire Season";
    if (element === "gfa_95Fz")
      return "95th Percentile Fire Size in 2023-24 Fire Season (km^2)";
    if (element === "gfa_95RAP")
      return "95th Percentile Rate of Growth Anomaly in 2023-24 Fire Season (%)";
    if (element === "gfa_95RRk")
      return "95th Percentile Rate of Growth Rank in 2023-24 Fire Season";
    if (element === "gfa_95Ros")
      return "95th Percentile Rate of Growth in 2023-24 Fire Season (km^2 day^-1)";
    if (element === "gfa_mxFz")
      return "Maximum Fire Size in 2023-24 Fire Season (km^2)";
    if (element === "gfa_mxRos")
      return "Maximum Rate of Growth in 2023-24 Fire Season (km^2 day^-1)";
    if (element === "gfa_nF")
      return "Number of Fires Rank in 2023-24 Fire Season";
    if (element === "gfa_nFAnP")
      return "Number of Fires Anomaly in 2023-24 Fire Season (%)";
    if (element === "gfa_nFRk")
      return "Number of Fires Rank in 2023-24 Fire Season";
    return element;
  });
  // console.log(newHeader)

  // Add keys to CSV as first row
  row = newHeader.join(",");
  csv += row + "\r\n";

  // Loop through each feature, extract values and add to csv
  for (let i = 0; i < activeLayer().features.length; i++) {
    let line = "";
    for (let j = 0; j < keysHeader.length; j++) {
      if (line !== "") line += ",";

      // For region names, remove any commas that may be present
      let value = "";
      if (keysHeader[j] === "reg_name") {
        value = activeLayer().features[i].properties[keysHeader[j]].replace(
          ",",
          ""
        );
        // console.log(value)
      } else {
        value = activeLayer().features[i].properties[keysHeader[j]];
      }

      line += value;
    }

    csv += line + "\r\n";
  }
  // console.log(csv.split("\n")[0])

  // 2. Create a blob, configure it, create an object URL and pass the blob object into the object URL
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8," });

  // 3. Create temporary link to download in the browser
  const downloadLink = document.createElement("a");
  downloadLink.download = `${activeLayer().name}`;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.style.display = "none"; // hide temporary link in browser

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
document
  .getElementById("btn-download-data")
  .addEventListener("click", exportCSV);

// Function to attach tooltip event listeners
function attachEventListeners() {
  document
    .querySelector("#legend-title")
    .addEventListener("mouseenter", function () {
      document.querySelector(".legendTooltip").style.display = "flex";
    });

  document
    .querySelector("#legend-title")
    .addEventListener("mouseleave", function () {
      document.querySelector(".legendTooltip").style.display = "none";
    });
}

// Choices select input functionality and styling
document.addEventListener("DOMContentLoaded", function () {
  const first = document.getElementById("first-selector");
  const second = document.getElementById("second-selector");
  const options = {
    searchEnabled: false,
    allowHTML: true,
    shouldSort: false,
    itemSelectText: "click to select",
  };
  const choices1 = new Choices(first, options);
  const choices2 = new Choices(second, options);
});

// // Add the event listener to the button
// document.getElementById('btn-save-image').addEventListener('click', function () {

//   var scale = 2;
//   leafletImage(map, function(err, canvas) {
//       if (err) {
//           console.error(err);
//           return;
//       }

//       // Create a scaled canvas
//       var scaledCanvas = document.createElement("canvas");
//       scaledCanvas.width = canvas.width * scale;
//       scaledCanvas.height = canvas.height * scale;
//       var ctx = scaledCanvas.getContext("2d");

//       // Fill the canvas with grey background
//       ctx.fillStyle = "#ddd";
//       ctx.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height);

//       // Scale and draw the map image onto the canvas
//       ctx.scale(scale, scale);
//       ctx.drawImage(canvas, 0, 0);

//       // Create an image from the scaled canvas
//       const img = document.createElement("img");
//       img.width = scaledCanvas.width;
//       img.height = scaledCanvas.height;
//       img.src = scaledCanvas.toDataURL();

//       // Create a link to download the image
//       const link = document.createElement("a");
//       link.href = img.src;
//       link.download = "State-of-Wildfires-map-image.png";
//       link.appendChild(img);
//       link.click();
//   });
// });
document.querySelector("#site-footer");
