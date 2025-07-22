// Import JS libraries
import Choices from "choices.js";

// Import CSS
import "choices.js/public/assets/styles/choices.min.css";

// Import variables from JS modules
// import { timeseries } from "./timeseries";
import { updateSecondSelector, updateThirdSelector } from "./selectors";
import { renderPlot } from "./echarts";
import { echartsPlot } from "./echarts";

// console.log(Object.keys(timeseries));
// console.log(timeseries);

// Import default data as JavaScript object
import {timeseriesBurned} from "./timeseries_burned";

// Create a time series object to store data
const timeseries = {
  burned: timeseriesBurned,
};

// Function to dynamically load additional data after initial load
function loadAdditionalData() {
  Promise.all([
    import("./timeseries_emissions.js"),
    import("./timeseries_atlas.js"),
    import("./timeseries_fire_size.js"),
    import("./timeseries_fire_growth.js"),
    import("./timeseries_fire_intensity.js")
  ])
  .then(([module2, module3, module4, module5, module6]) => {
    // Emissions
    const emissions = module2.timeseriesEmissions;
    timeseries.emissions = emissions;
    // Atlas
    const atlas = module3.timeseriesAtlas;
    timeseries.atlas = atlas;
    // Fire Size
    const fireSize = module4.timeseriesFireSize;
    timeseries.fireSize = fireSize;
    // Fire Growth
    const fireGrowth = module5.timeseriesFireGrowth;
    timeseries.fireGrowth = fireGrowth;
    // Fire Intensity
    const fireIntensity = module6.timeseriesFireIntensity;
    timeseries.fireIntensity = fireIntensity;
    // console.log(timeseries.fireIntensity)
    // console.log(timeseries.atlas)
    // console.log(timeseries.burned)
  })
  .catch(error => {
    console.error("Error loading additional data:", error);
  });
};

// Load additional data after initial load
window.addEventListener("load", () => {
  loadAdditionalData();
});

// Select elements from DOM
const first = document.getElementById("first-selector");
const second = document.getElementById("second-selector");
const third = document.getElementById("third-selector");

// ---------- //
// Set up default choices
// ---------- //

// Default choices for all selectors
const defaultVariableChoices = "burned";
const defaultLayerChoices = "Countries";
const defaultRegionChoices = ["Australia","Canada","Congo","Russian Federation","United States"];

// Choices initation
let choices1;
let choices2;
let choices3;

// Choices select input and chart defaults once DOM content has loaded
document.addEventListener("DOMContentLoaded", () => {
  choices1 = new Choices(first, {
    searchEnabled: false,
    allowHTML: true,
    shouldSort: false,
    itemSelectText: "click to select",
  });
  choices2 = new Choices(second, {
    choices: updateSecondSelector(timeseries, defaultVariableChoices, true),
    searchEnabled: false,
    allowHTML: true,
    shouldSort: true,
    itemSelectText: "click to select",
  });
  choices3 = new Choices(third, {
    choices: updateThirdSelector(timeseries, defaultVariableChoices, defaultLayerChoices, true),
    searchEnabled: true,
    allowHTML: true,
    shouldSort: false,
    itemSelectText: "click to select",
    removeItemButton: true,
    placeholderValue: "Select Region",
    maxItemCount: 8,
  });

  // Third selector values
  // const thirdSelectorValues = choices3.getValue(true);

  // Reposition "Select Region" to start
  moveSelectRegiontoFront();
  
  // Render default chart
  renderPlot(timeseries, defaultVariableChoices, defaultLayerChoices, defaultRegionChoices);

  // Make sure the choice3 multiple select input dropdown is the same width as the container
  const choices3Width = choices3.containerOuter.element.offsetWidth;
  document.documentElement.style.setProperty("--choices3-width", `${choices3Width}px`);
});

// ---------- //
// Programmatically update selectors and plot
// ---------- //

// Update selectors and plot when FIRST selector is changed
first.addEventListener("change", () => {

  const firstValue = first.value;
  const secondValue = second.value;

  choices2.destroy();
  choices2 = new Choices(second, {
    choices: updateSecondSelector(timeseries, firstValue, false, secondValue),
    searchEnabled: false,
    allowHTML: true,
    shouldSort: true,
    itemSelectText: "click to select",
  });

  const thirdSelectorCheckedOld = document.querySelectorAll("#third-selector option:checked");
  const thirdSelectorValuesOld = Array.from(thirdSelectorCheckedOld).map(i => i.value);

  choices3.destroy();
  choices3 = new Choices(third, {
    choices: updateThirdSelector(timeseries, firstValue, secondValue, false, thirdSelectorValuesOld),
    searchEnabled: true,
    allowHTML: true,
    shouldSort: false,
    itemSelectText: "click to select",
    removeItemButton: true,
    placeholderValue: "Select Region",
    maxItemCount: 8,
  });

  // Get elements from DOM
  const variableAtlas = document.querySelector("#choices--first-selector-item-choice-3");
  const variableFireSize = document.querySelector("#choices--first-selector-item-choice-4");
  const variableFireGrowth = document.querySelector("#choices--first-selector-item-choice-5");
  const variableFireIntensity = document.querySelector("#choices--first-selector-item-choice-6");

  // Remove any previous display equals none for variables
  variableAtlas.style.display = "block";
  variableFireSize.style.display = "block";
  variableFireGrowth.style.display = "block";
  variableFireIntensity.style.display = "block";

  // If a layer is selected which has no data for a variable then do not display that in the input box
  if (second.value !== "Countries" && second.value !== "Continents" && second.value !== "Global Fire Emissions Database Regions" && second.value !== "Biomes" && second.value !== "Continental Biomes" && second.value !== "IPCC Regions" && second.value !== "States and Provinces" && second.value !== "Ecoregions") {
      variableAtlas.style.display = "none";
      variableFireSize.style.display = "none";
      variableFireGrowth.style.display = "none";
      variableFireIntensity.style.display = "none";
  };

  // Reposition "Select Region" to start
  moveSelectRegiontoFront();

  const thirdSelectorCheckedNew = document.querySelectorAll("#third-selector option:checked");
  const thirdSelectorValuesNew = Array.from(thirdSelectorCheckedNew).map(i => i.value);
  renderPlot(timeseries, first.value, second.value, thirdSelectorValuesNew);
})

// Update selectors and plot when SECOND selector is changed
second.addEventListener("change", () => {

  const firstValue = first.value;
  const secondValue = second.value;

  const thirdSelectorCheckedOld = document.querySelectorAll("#third-selector option:checked");
  const thirdSelectorValuesOld = Array.from(thirdSelectorCheckedOld).map(i => i.value);

  choices3.destroy();
  choices3 = new Choices(third, {
    choices: updateThirdSelector(timeseries, firstValue, secondValue, false, thirdSelectorValuesOld),
    searchEnabled: true,
    allowHTML: true,
    shouldSort: false,
    itemSelectText: "click to select",
    removeItemButton: true,
    placeholderValue: "Select Region",
    maxItemCount: 8,
  });

  // Get elements from DOM
  const variableAtlas = document.querySelector("#choices--first-selector-item-choice-3");
  const variableFireSize = document.querySelector("#choices--first-selector-item-choice-4");
  const variableFireGrowth = document.querySelector("#choices--first-selector-item-choice-5");
  const variableFireIntensity = document.querySelector("#choices--first-selector-item-choice-6");

  // Remove any previous display equals none for variables
  variableAtlas.style.display = "block";
  variableFireSize.style.display = "block";
  variableFireGrowth.style.display = "block";
  variableFireIntensity.style.display = "block";

  // If a layer is selected which has no data for a variable then do not display that in the input box
  if (second.value !== "Countries" && second.value !== "Continents" && second.value !== "Global Fire Emissions Database Regions" && second.value !== "Biomes" && second.value !== "Continental Biomes" && second.value !== "IPCC Regions" && second.value !== "States and Provinces" && second.value !== "Ecoregions") {
      variableAtlas.style.display = "none";
      variableFireSize.style.display = "none";
      variableFireGrowth.style.display = "none";
      variableFireIntensity.style.display = "none";
  };

  // Reposition "Select Region" to start
  moveSelectRegiontoFront();

  const thirdSelectorChecked = document.querySelectorAll("#third-selector option:checked");
  const thirdSelectorValuesNew = Array.from(thirdSelectorChecked).map(i => i.value);
  renderPlot(timeseries, firstValue, secondValue, thirdSelectorValuesNew);
});

// Update selectors and plot when THIRD selector is changed
third.addEventListener("change", () => {

  const firstValue = first.value;
  const secondValue = second.value;

  const thirdSelectorChecked = document.querySelectorAll("#third-selector option:checked");
  const thirdSelectorValuesNew = Array.from(thirdSelectorChecked).map(i => i.value);
  renderPlot(timeseries, firstValue, secondValue, thirdSelectorValuesNew);
});

// ---------- //
// Additional functions
// ---------- //

// Resize ECharts plot when screen size changes
window.onresize = function() {
  echartsPlot.resize();
};

// Resize width of choices shen screen size change
window.addEventListener("resize", () => {
  const choices3Width = choices3.containerOuter.element.offsetWidth;
  document.documentElement.style.setProperty("--choices3-width", `${choices3Width}px`);
});

// Function to move "Select Region" to start of select box
function moveSelectRegiontoFront () {
  const choicesInner = document.querySelector("body > div.container-fluid.text-center > div.row.py-2 > div:nth-child(3) > div > div.choices__inner");
  const inputElement = choicesInner.querySelector(".choices__input--cloned");
  const divElement = choicesInner.querySelector(".choices__list--multiple");
  choicesInner.insertBefore(inputElement, divElement);
};
