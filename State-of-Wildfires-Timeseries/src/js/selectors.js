// ---------- //
// Function to update second selector
// ---------- //

export const updateSecondSelector = function(timeseries, firstSelectorVal, defaultVal = false, secondSelectorVal) {

    // Initiate value
    let layerSelected;

    // Show countries on first load else get the current layer selected
    layerSelected = defaultVal === true ? "Countries" : secondSelectorVal;
    // console.log(layerSelected);

    // Set default second selector choices based on first selector value
    const secondChoices = Object.keys(timeseries[firstSelectorVal]);
    // console.log(secondChoices)

    // Check that selected layer is in the new set of layers available for variable, if not default to countries
    // layerSelected = secondChoices.includes(layerSelected) ? layerSelected : "Countries";

    // Format array of choices for second selector
    const secondChoicesFormat = secondChoices.map((item, index) => {
        return {
            value: item,
            label: item,
            id: index + 1,
            // Select the layer defined in layerSelected
            selected: item === layerSelected ? true : false,
        };
    });
    // console.log(secondChoicesFormat)

    // Return formatted second selector choices
    return secondChoicesFormat;
};

// ---------- //
// Function to update third selector
// ---------- //

export const updateThirdSelector = function(timeseries, firstSelectorVal, secondSelectorVal, defaultVal = false, thirdSelectorValuesOld) {

    // Layer selected
    const layerSelected = secondSelectorVal;

    // Array of region labels to populate third selector choices
    const thirdChoices = Object.keys(timeseries[firstSelectorVal][layerSelected]);
    // console.log(thirdChoices);

    // Array of objects for each region in active variable (for last year in data, typically 2023)
    const activeRegionObj = Object.values(timeseries[firstSelectorVal][layerSelected]).map( i => i.slice(-1)[0] );
    // console.log(activeRegionObj);

    // Extract the name of the active variable (e.g. if "burned" return "Burned Area (km^2)")
    const variableName = firstSelectorVal === "burned"    ? "Burned Area (km^2)" :
                         firstSelectorVal === "emissions" ? "Carbon Emitted"     :
                         firstSelectorVal === "atlas"     ? "Number of Fires"    :
                         firstSelectorVal === "fireIntensity" ? "Average Fire's 95th Percentile FRP (MW)" :
                         firstSelectorVal === "fireSize"  ? "95th Percentile Fire Size (km^2)" : "95th Percentile Rate of Growth (km^2 day^-1)";

    // Array of values for each region in active variable  (for last year in data, typically 2023)
    const activeValues = activeRegionObj.map( i => i[variableName] );
    // console.log(activeValues);

    // Return an array of regions (thirdSelectorValues) with the highest value for activeValues
    const numRegions = 5;
    const topIndexes = [...activeValues.keys()]
        .sort( (a, b) => activeValues[b] - activeValues[a] )
        .slice(0, numRegions);
    const topRegions = topIndexes.map( i => thirdChoices[i] );
    // console.log(topRegions);

    // Initiate region array to selected in third box
    let thirdSelectorValues;

    // Print default countries if true, otherwise run downstream code
    if (defaultVal) {
        // Array of countries to show
        const defaultCountries = ["Australia","Canada","Congo","Russian Federation","United States"];
        thirdSelectorValues = defaultCountries;
    } else {
        // Check every current region selected matches the new third choices, if not then load the top 5 by numerical order for the new layer
        const isMatch = thirdSelectorValuesOld.every(i => thirdChoices.includes(i));
        // console.log(isMatch);
        thirdSelectorValues = isMatch ? thirdSelectorValuesOld : topRegions;
    };


    // Format array of choices for third selector
    const thirdChoicesFormat = thirdChoices.map((item, index) => {
        return {
            value: item,
            label: item,
            id: index + 1,
            selected: thirdSelectorValues.includes(item) ? true : false,
        };
    });
    // console.log(thirdChoicesFormat);

    // Return formatted second selector choices
    return thirdChoicesFormat;
};