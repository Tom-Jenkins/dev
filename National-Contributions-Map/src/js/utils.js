// Function to colour polygons
export const colourPolygons = function(val, scale, colPalette) {

    // Define the color for "Insufficient Data"
    const noDataColor = "#808080";
  
    // Check if val is null or undefined
    if (val === null || val === undefined) {
      return noDataColor;
    }
  
    // Return colour based on value
    return val >= scale[0] ? colPalette[0] : // >= 15
           val >= scale[1] ? colPalette[1] : // >= 10
           val >= scale[2] ? colPalette[2] : // >= 5
           val >= scale[3] ? colPalette[3] : // >= 4
           val >= scale[4] ? colPalette[4] : // >= 3
           val >= scale[5] ? colPalette[5] : // >= 2
           val >= scale[6] ? colPalette[6] : // >= 1
           val >= scale[7] ? colPalette[7] : // >= 0.5
           val >= scale[8] ? colPalette[8] : // >= 0.1
           val >= scale[9] ? colPalette[9] : // >= 0
           colPalette[10]; // negative values
};

// Function to render popup content
export const popupContent = function(properties, gas, source, chartId) {

  const html = `
    <div>
      <p class="text-start fw-bold" style="margin: 0;">${properties.Country}</p>
      <p class="text-start" style="margin-top: 5px; margin-bottom: 7.5px;">
        <span style="color: grey;">Source:</span>&nbsp;${source}<br>
        <span style="color: grey;">Gas:</span>&nbsp;${gas}<br>
      </p>
    </div>
    <div id="${chartId}" style="width: 100%; height: 150px;"></div>
  `;

  return html;
};

// Function to display the correct decimal place
export const decimalPlace = function (value) {

  // console.log(value)
  
  // 1 decimal place for values >= 10
  if (value >= 10) return value.toFixed(1);

  // 1 decimal place for values between 1 and 10
  if (value >= 1 && value < 10) return value.toFixed(1);

  // 2 decimal places for values between 0.001 and 1
  if (value > 0.001 && value < 1) return value.toFixed(2);

  // 1 significant figure between zero and 0.001
  if (value <= 0.001 && value >= 0) return value.toPrecision(1);

  // 2 significant figure if negative
  if (value < 0) return value.toPrecision(2);
};


