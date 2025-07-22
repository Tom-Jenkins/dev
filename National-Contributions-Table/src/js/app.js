// Import JS libraries
import { TabulatorFull as Tabulator } from "tabulator-tables";
import Choices from "choices.js";

// Import CSS
import "tabulator-tables/dist/css/tabulator_bootstrap5.min.css";
import "choices.js/public/assets/styles/choices.min.css";

// Import table data
import { tableData } from "./table_all_data";

// Array of countries
const countries = tableData["1851_3GHG"].map(i => i.Country).sort();

// Declare Tabulator variable
let table;

// Declare array of indexes which are the rows currently pinned
let rowsPinned = [];

// Colour function for warming contribution
const scale = [15, 10, 5, 4, 3, 2, 1, 0.5, 0.1, 0, 0];
const colPalette = ["#13051D", "#3A0E5B", "#9D2A62", "#D74F3E", "#E9672C", "#F68614", "#FAB124", "#FBD54F", "#FDED81", "#FCFC9E", "#DEEEF8"];
import { colourPolygons } from "../../../National-Contributions-Map/src/js/utils.js";

// Decimal place threshold for displaying values
// const decimalPlace = 2;
// const decimalThreshold = 0.01;

// Import decimal place function for displaying percentage values
import { decimalPlace } from "../../../National-Contributions-Map/src/js/utils.js";

// Create new Tabulator table
table = new Tabulator("#tabulator-table", {
    data: tableData["1851_3GHG"],
    selectable: false,
    layout: "fitDataFill", // "fitDataFill" "fitColumns"
    columnHeaderVertAlign: "bottom", // "bottom" "middle" "top"
    movableRows: false,
    index: "Country",
    columns: [
        { title: "Rank", field: "Rank", sorter: "number" },
        { 
            title: "Country",
            titleFormatter: (cell) => {
                const value = cell.getValue();
                return `
                <div class="tabulator-col-title">
                    <p id="info-icon-tooltip" class="text-start info-icon-style" style="display: none; width: auto;">
                        Click Rows to Pin / Unpin
                    </p>
                    <span class="pe-1">${value}</span>
                    <span id="info-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#95a5a6" class="bi bi-info-circle-fill" viewBox="0 0 16 18">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                        </svg>
                    </span>
                    <br>
                    <div id="country-wrapper">
                        <select id="country-select" class="mt-2">
                            <option value="" disabled selected>Select Country to Pin to Top ...</option>
                            ${countries.map(i => `<option value="${i}">${i}</option>`).join("")}
                        </select>
                    </div>
                </div>`;
            },
            field: "Country",
            formatter: cell => `<b>${cell.getValue()}</b>`, // bold country names
        }, 
        // Empty column to create gap
        // { title: "", headerSort: false, width: 0, resizable: false },
        {
            title: "Warming Contribution",
            headerHozAlign: "center",
            columns: [
                // {
                //     title: "Celsius",
                //     titleFormatter: () => {
                //         return `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<sup>o</sup>C</span>`;
                //     },
                //     headerHozAlign: "center",
                //     hozAlign: "right",
                //     titleDownload: "Warming Contribution (celsius)",
                //     field: "Abs_contribution",
                //     headerSort: false,
                //     formatter: (cell) => {
                //         const value = cell.getValue();
                //         return value > decimalThreshold ? value.toFixed(decimalPlace) // return original value to X decimal places
                //             : value < decimalThreshold && value > 0 ? `<${decimalThreshold}` // return <0.01
                //             : value === 0 ? value.toFixed(decimalThreshold) // return 0.00 if zero
                //             : value.toFixed(8); // return negative value to X decimal places
                //     },
                // },
                {
                    title: "%",
                    titleDownload: "Warming Contribution (%)",
                    width: 95,
                    widthShrink: 0,
                    field: "Perc_contribution",
                    sorter: "number",
                    headerHozAlign: "right",
                    hozAlign: "right",
                    headerSort: false,
                    formatter: (cell) => {
                        const value = cell.getValue();
                        // display when value is equal to or greater than 0.01
                        if (value > 0.01) {
                            // return value.toFixed(decimalPlace);
                            return decimalPlace(value);
                        };
                        // display when value is between 0.01 and 0.00
                        if (value <= 0.01 && value >= 0) {
                            return "0.01-0.00";
                        };
                        // display when values are negative
                        if (value < 0) {
                            return value.toFixed(2);
                        };
                        // return value < decimalThreshold ? `<${decimalThreshold}` : value.toFixed(decimalPlace);
                    },
                },
                {
                    title: " ",
                    width: 130,
                    widthShrink: 0,
                    download: false,
                    field: "Perc_contribution_rescale",
                    headerSort: false,
                    formatter: (cell, formatterParams) => {
                        // value of rescale column
                        const value = cell.getValue();

                        // value of percentage contribution column
                        const percContribution = cell.getData().Perc_contribution;

                        // colour of progress bar
                        const colour = colourPolygons(percContribution, scale, colPalette);

                        // return the progress bar with the computed colour
                        return `<div style="background-color: ${colour}; width: ${value}%; height: 100%;"></div>`;
                    }
                },               
            ]
        },
        // Empty column to create gap
        { title: "", headerSort: false, width: 0, resizable: false },
        {
            title: "Source (%)",
            headerHozAlign: "center",
            columns: [
                // {title:"Fossil Fraction", field:"Fossil_fraction", sorter: "number", hozAlign:"left"},
                // {title:"Land Fraction", field:"Land_fraction", sorter: "number", hozAlign:"left"},
                {
                    title: "Fossil Fuels",
                    titleDownload: "Fraction from Fossil Fuels",
                    headerSort: false,
                    field: "Fossil_fraction",
                    width: 185,
                    widthShrink: 0,
                    sorter: "number",
                    hozAlign: "left",
                    formatter: "progress",
                    formatterParams: { 
                        min: 0,
                        max: 100,
                        color: "#525252",
                        legend: " ",
                        legendColor: "white",
                        // legendAlign: "left",
                    },
                    cellMouseOver: (e, cell) => {
                        const value = cell.getValue(); // cell value
                        const element = cell.getElement(); // cell DOM element
                        const percentageValue = cell.getData().Perc_contribution; // value for percentage change
                        // console.log(percentageValue)
                        element.querySelector("div:nth-child(2)").style.paddingLeft = "5px";
                        element.querySelector("div:nth-child(2)").style.paddingRight = "5px";
                        element.querySelector("div:nth-child(2)").style.backgroundColor = "black";
                        element.querySelector("div:nth-child(2)").style.width = "fit-content";
                        element.querySelector("div:nth-child(2)").style.fontSize = "90%";
                        element.querySelector("div:nth-child(2)").style.left = "auto";
                        element.querySelector("div:nth-child(2)").style.right = "0";
                        element.querySelector("div:nth-child(2)").style.borderRadius = "5px";
                        element.querySelector("div:nth-child(2)").style.opacity = "0.90";
                        
                        // If percentage change is negative then display "n/a"
                        if (Number(percentageValue) < 0 ) {
                            element.querySelector("div:nth-child(2)").textContent = "N/A";
                        } else {
                            const content = Number(value) === 100 ? `100 %` : `${Number(value).toFixed(1)} %`;
                            element.querySelector("div:nth-child(2)").textContent = content; // show percentage on hover
                        };
                    },
                    cellMouseOut: (e, cell) => {
                        const element = cell.getElement(); // cell DOM element
                        element.querySelector("div:nth-child(2)").style.paddingLeft = 0;
                        element.querySelector("div:nth-child(2)").textContent = " "; // remove when not hovering
                    },
                },
                {
                    title: "Land Use Change",
                    titleDownload: "Fraction from Land Use Change",
                    headerSort: false,
                    field: "Land_fraction",
                    width: 185,
                    widthShrink: 0,
                    sorter: "number",
                    hozAlign: "left",
                    formatter: "progress",
                    formatterParams: {
                        min: 0,
                        max: 100,
                        color: "#8c510a",
                        legend: " ",
                        legendColor: "white",
                        // legendAlign: "right",
                    },
                    cellMouseOver: (e, cell) => {
                        const value = cell.getValue(); // cell value
                        const element = cell.getElement(); // cell DOM element
                        const percentageValue = cell.getData().Perc_contribution; // value for percentage change
                        // console.log(percentageValue)
                        element.querySelector("div:nth-child(2)").style.paddingLeft = "5px";
                        element.querySelector("div:nth-child(2)").style.paddingRight = "5px";
                        element.querySelector("div:nth-child(2)").style.backgroundColor = "black";
                        element.querySelector("div:nth-child(2)").style.width = "fit-content";
                        element.querySelector("div:nth-child(2)").style.fontSize = "90%";
                        element.querySelector("div:nth-child(2)").style.left = "auto";
                        element.querySelector("div:nth-child(2)").style.right = "0";
                        element.querySelector("div:nth-child(2)").style.borderRadius = "5px";
                        element.querySelector("div:nth-child(2)").style.opacity = "0.90";
                        
                        // If percentage change is negative then display "n/a"
                        if (Number(percentageValue) < 0 ) {
                            element.querySelector("div:nth-child(2)").textContent = "N/A";
                        } else {
                            const content = Number(value) === 100 ? `100 %` : `${Number(value).toFixed(1)} %`;
                            element.querySelector("div:nth-child(2)").textContent = content; // show percentage on hover
                        };                 
                    },
                    cellMouseOut: (e, cell) => {
                        const element = cell.getElement(); // cell DOM element
                        element.querySelector("div:nth-child(2)").style.paddingLeft = 0;
                        element.querySelector("div:nth-child(2)").textContent = " "; // remove when not hovering
                    },
                },
            ]
        },
    ],
    initialSort: [
        { column: "Rank", dir: "asc" },
    ],
});


// ------------------- //
// Choices Event Listeners
// ------------------- //

// Initiate variables
let choicesGas, choicesPeriod

// Choices select input functionality and styling
document.addEventListener("DOMContentLoaded", function () {
  const first = document.getElementById("gas-selector");
  const second = document.getElementById("period-selector");
  const options = {
    searchEnabled: false,
    allowHTML: true,
    shouldSort: false,
    itemSelectText: "click to select",
  };
  choicesGas = new Choices(first, options);
  choicesPeriod = new Choices(second, options);
});


// ------------------- //
// Change Data When Choices Changes
// ------------------- //

// Get element from DOM
const gasSelector = document.getElementById("gas-selector");
const periodSelector = document.getElementById("period-selector");

// Update table with new data when user selects a different greenhouse gas
gasSelector.addEventListener("change", () => {
    const gas = gasSelector.value;
    const timePeriod = periodSelector.value;
    const variables = `${timePeriod}_${gas}`
    table.setData(tableData[variables]);

    // Keep countries pinned to top of table if they are in rowPinned array
    const allCountries = table.getData().map(i => i.Country);
    const countryIndex = rowsPinned.map(country => allCountries.indexOf(country));
    const rowsToPin = countryIndex.map(row => table.getRows()[row]);
    rowsToPin.map(i => i.freeze());
});

// Update table with new data when user selects a different time period
periodSelector.addEventListener("change", () => {
    const gas = gasSelector.value;
    const timePeriod = periodSelector.value;
    const variables = `${timePeriod}_${gas}`
    table.setData(tableData[variables]);

    // Keep countries pinned to top of table if they are in rowPinned array
    const allCountries = table.getData().map(i => i.Country);
    const countryIndex = rowsPinned.map(country => allCountries.indexOf(country));
    const rowsToPin = countryIndex.map(row => table.getRows()[row]);
    rowsToPin.map(i => i.freeze());
});

// // ------------------- //
// // Radio Button Event Listeners (previous version)
// // ------------------- //

// // Function to find the radio input that is selected and return its value
// const getCheckedRadioInput = function () {
//     const checkedRadio = document.querySelector("input[name='value-radio']:checked");
//     return checkedRadio.value;
// };

// // Update table with new data when user selects a different time period
// document.getElementById("radio-selector").addEventListener("change", () => {
//     const timePeriod = getCheckedRadioInput();
//     table.setData(tableData[timePeriod]);
// });


// ------------------- //
// Animate Time Period Event Listener
// ------------------- //

// Function to create new Promise
const wait = function(time) {
  return new Promise(resolve => setTimeout(resolve, time));
};

// Function to process each map layer sequentially to animate map layers
const mapAnimation = async function () {

    // empty array of pinned countries
    rowsPinned = [];

    // get greenhouse gas value from DOM
    const gas = gasSelector.value;
    
    // 1851
    const variable1851 = `1851_${gas}`
    table.setData(tableData[variable1851]);
    choicesPeriod.setChoiceByValue("1851");
    await wait(1000); // wait 1 second    

    // 1990
    const variable1990 = `1990_${gas}`
    table.setData(tableData[variable1990]);
    choicesPeriod.setChoiceByValue("1990");
    await wait(1000); // wait 1 second  

    // 2005
    const variable2005 = `2005_${gas}`
    table.setData(tableData[variable2005]);
    choicesPeriod.setChoiceByValue("2005");
    await wait(1000); // wait 1 second  

    // 2020
    const variable2020 = `2020_${gas}`
    table.setData(tableData[variable2020]);
    choicesPeriod.setChoiceByValue("2020");
    await wait(1000); // wait 1 second  
};

// Run animation when user clicks button
document.getElementById("btn-animate").addEventListener("click", mapAnimation);


// ------------------- //
// Download Table Event Listener
// ------------------- //

// Download table on click of button
document.getElementById("btn-download").addEventListener("click", (e) => {
    e.preventDefault();
    const gas = gasSelector.value;
    const timePeriod = periodSelector.value;
    const variables = `${timePeriod}_${gas}`;
    table.download("csv", `${variables}_table.csv`);
});


// ------------------- //
// On Table Build
// ------------------- //

// Run this code after the table has rendered
table.on("tableBuilt", () => {

    // Get elements from DOM
    const infoIcon = document.getElementById("info-icon");
    const infoIconTooltip = document.getElementById("info-icon-tooltip");
    const countrySelect = document.getElementById("country-select");
    // const countrySelectWrapper = document.getElementById("country-wrapper");

    // Show tooltip on mouse hover
    infoIcon.addEventListener("mouseenter", () => {
        infoIconTooltip.style.display = "flex";
    });

    // Remove tooltip when not hovering
    infoIcon.addEventListener("mouseleave", () => {
        infoIconTooltip.style.display = "none";
    });

    // Style country selector as Choices class
    // const options = {
    //     searchEnabled: false,
    //     allowHTML: true,
    //     shouldSort: false,
    //     itemSelectText: "click to select",
    //   };
    // const choicesCountrySearch = new Choices(countrySelect, options);
    
    // Add an event listener to the input to stop propagation and allow user to use country selector
    countrySelect.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // Pin row when country is selected
    countrySelect.addEventListener("change", () => {
        
        const country = countrySelect.value;

        // Previous code for scrolling to row
        // table.scrollToRow(country, "top", true); // "top" "center" "nearest" "bottom"

        // Find country row and freeze or unfreeze depending on current pin status
        const countryIndex = table.getData().map(i => i.Country).indexOf(country);
        const row = table.getRows()[countryIndex];
        const rowFrozen = row.isFrozen();
        const rowCountry = row.getIndex();
        
        // Pin row if not frozen and add country to rowPinned array
        if (!rowFrozen) {
            row.freeze();
            rowsPinned.push(rowCountry);
        };

        // Unpin row if frozen and remove country from rowPinned array
        if (rowFrozen) {
            row.unfreeze();
            rowsPinned = rowsPinned.filter(country => country !== rowCountry);
        };

        // console.log(rowsPinned);

        // Revert back to the placeholder
        countrySelect.selectedIndex = 0;
    });
});


// ------------------- //
// Reset Table
// ------------------- //

// Add event listener to reset button which re-draws table
document.getElementById("btn-reset").addEventListener("click", () => {
    rowsPinned = [];
    table.setData(tableData["1851_3GHG"]);
    table.clearSort();
    choicesGas.setChoiceByValue("3GHG");
    choicesPeriod.setChoiceByValue("1851");
});

// ------------------- //
// Programmatically Move Row
// ------------------- //

// // When a row is clicked, move it to the top of the table (index zero)
// table.on("rowClick", (e, row) => {
//     const rowIndex = row.getIndex();
//     const rowData = row.getData();
//     table.deleteRow(rowIndex); // remove row from its current position
//     table.addRow(rowData, true); // add row to the top of the table
// });


// ------------------- //
// Programmatically Pin Row(s)
// ------------------- //

// When a row is clicked, pin it to the top of table
table.on("rowClick", (e, row) => {

    // get country clicked
    const rowCountry = row.getIndex();

    // check if row is pinned (frozen) already
    const rowFrozen = row.isFrozen();

    // Pin row if not frozen and add country to rowPinned array
    if (!rowFrozen) {
        row.freeze();
        rowsPinned.push(rowCountry);
    };

    // Unpin row if frozen and remove country from rowPinned array
    if (rowFrozen) {
        row.unfreeze();
        rowsPinned = rowsPinned.filter(country => country !== rowCountry);
    };

    // console.log(rowsPinned);
});
