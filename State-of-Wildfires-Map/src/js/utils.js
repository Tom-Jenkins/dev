// Function to colour polygons
export const colourPolygons = function(d, variable, scaleObj, colPalette) {

    // Define the color for "Insufficient Data"
    const noDataColor = "#808080";
  
    // Check if d is null or undefined
    if (d === null || d === undefined) {
      return noDataColor;
    }
  
    // Burned Area Anomaly in Final Year
    if (variable === "ba_anom") {
      return d < scaleObj.ba_anom[8] ? colPalette[8] :
             d >= scaleObj.ba_anom[8] && d < scaleObj.ba_anom[7] ? colPalette[7] :
             d >= scaleObj.ba_anom[7] && d < scaleObj.ba_anom[6] ? colPalette[6] :
             d >= scaleObj.ba_anom[6] && d <= scaleObj.ba_anom[5] ? colPalette[5] :
             d > scaleObj.ba_anom[5] && d < scaleObj.ba_anom[4] ? colPalette[5] :
             d >= scaleObj.ba_anom[4] && d < scaleObj.ba_anom[3] ? colPalette[4] :
             d >= scaleObj.ba_anom[3] && d < scaleObj.ba_anom[2] ? colPalette[3] :
             d >= scaleObj.ba_anom[2] && d < scaleObj.ba_anom[1] ? colPalette[2] :
             d >= scaleObj.ba_anom[1] && d < scaleObj.ba_anom[0] ? colPalette[1] : colPalette[0];
    };
  
    // Carbon Emitted Anomaly in Final Year
    if (variable === "cem_emAn") {
      return d < scaleObj.cem_emAn[8] ? colPalette[8] :
             d >= scaleObj.cem_emAn[8] && d < scaleObj.cem_emAn[7] ? colPalette[7] :
             d >= scaleObj.cem_emAn[7] && d < scaleObj.cem_emAn[6] ? colPalette[6] :
             d >= scaleObj.cem_emAn[6] && d <= scaleObj.cem_emAn[5] ? colPalette[5] :
             d > scaleObj.cem_emAn[5] && d < scaleObj.cem_emAn[4] ? colPalette[5] :
             d >= scaleObj.cem_emAn[4] && d < scaleObj.cem_emAn[3] ? colPalette[4] :
             d >= scaleObj.cem_emAn[3] && d < scaleObj.cem_emAn[2] ? colPalette[3] :
             d >= scaleObj.cem_emAn[2] && d < scaleObj.cem_emAn[1] ? colPalette[2] :
             d >= scaleObj.cem_emAn[1] && d < scaleObj.cem_emAn[0] ? colPalette[1] : colPalette[0];
    };
  
    // Number of Fires Anomaly in Final Year
    if (variable === "gfa_nFAnP") {
      return d < scaleObj.gfa_nFAnP[8] ? colPalette[8] :
             d >= scaleObj.gfa_nFAnP[8] && d < scaleObj.gfa_nFAnP[7] ? colPalette[7] :
             d >= scaleObj.gfa_nFAnP[7] && d < scaleObj.gfa_nFAnP[6] ? colPalette[6] :
             d >= scaleObj.gfa_nFAnP[6] && d <= scaleObj.gfa_nFAnP[5] ? colPalette[5] :
             d > scaleObj.gfa_nFAnP[5] && d < scaleObj.gfa_nFAnP[4] ? colPalette[5] :
             d >= scaleObj.gfa_nFAnP[4] && d < scaleObj.gfa_nFAnP[3] ? colPalette[4] :
             d >= scaleObj.gfa_nFAnP[3] && d < scaleObj.gfa_nFAnP[2] ? colPalette[3] :
             d >= scaleObj.gfa_nFAnP[2] && d < scaleObj.gfa_nFAnP[1] ? colPalette[2] :
             d >= scaleObj.gfa_nFAnP[1] && d < scaleObj.gfa_nFAnP[0] ? colPalette[1] : colPalette[0];
    };
  
    // 95th Percentile Fire Size Anomaly in Final Yea
    if (variable === "gfa_95FAP") {
      return d < scaleObj.gfa_95FAP[8] ? colPalette[8] :
             d >= scaleObj.gfa_95FAP[8] && d < scaleObj.gfa_95FAP[7] ? colPalette[7] :
             d >= scaleObj.gfa_95FAP[7] && d < scaleObj.gfa_95FAP[6] ? colPalette[6] :
             d >= scaleObj.gfa_95FAP[6] && d <= scaleObj.gfa_95FAP[5] ? colPalette[5] :
             d > scaleObj.gfa_95FAP[5] && d < scaleObj.gfa_95FAP[4] ? colPalette[5] :
             d >= scaleObj.gfa_95FAP[4] && d < scaleObj.gfa_95FAP[3] ? colPalette[4] :
             d >= scaleObj.gfa_95FAP[3] && d < scaleObj.gfa_95FAP[2] ? colPalette[3] :
             d >= scaleObj.gfa_95FAP[2] && d < scaleObj.gfa_95FAP[1] ? colPalette[2] :
             d >= scaleObj.gfa_95FAP[1] && d < scaleObj.gfa_95FAP[0] ? colPalette[1] : colPalette[0];
    };
  
    // 95th Percentile Rate of Growth Anomaly in Final Year
    if (variable === "gfa_95RAP") {
      return d < scaleObj.gfa_95RAP[8] ? colPalette[8] :
             d >= scaleObj.gfa_95RAP[8] && d < scaleObj.gfa_95RAP[7] ? colPalette[7] :
             d >= scaleObj.gfa_95RAP[7] && d < scaleObj.gfa_95RAP[6] ? colPalette[6] :
             d >= scaleObj.gfa_95RAP[6] && d <= scaleObj.gfa_95RAP[5] ? colPalette[5] :
             d > scaleObj.gfa_95RAP[5] && d < scaleObj.gfa_95RAP[4] ? colPalette[5] :
             d >= scaleObj.gfa_95RAP[4] && d < scaleObj.gfa_95RAP[3] ? colPalette[4] :
             d >= scaleObj.gfa_95RAP[3] && d < scaleObj.gfa_95RAP[2] ? colPalette[3] :
             d >= scaleObj.gfa_95RAP[2] && d < scaleObj.gfa_95RAP[1] ? colPalette[2] :
             d >= scaleObj.gfa_95RAP[1] && d < scaleObj.gfa_95RAP[0] ? colPalette[1] : colPalette[0];
    };
    
    // Average Fire's 95ᵗʰ Percentile FRP (MW)
    if (variable === "frp_95dPc") {
      return d < scaleObj.frp_95dPc[8] ? colPalette[8] :
             d >= scaleObj.frp_95dPc[8] && d < scaleObj.frp_95dPc[7] ? colPalette[7] :
             d >= scaleObj.frp_95dPc[7] && d < scaleObj.frp_95dPc[6] ? colPalette[6] :
             d >= scaleObj.frp_95dPc[6] && d <= scaleObj.frp_95dPc[5] ? colPalette[5] :
             d > scaleObj.frp_95dPc[5] && d < scaleObj.frp_95dPc[4] ? colPalette[5] :
             d >= scaleObj.frp_95dPc[4] && d < scaleObj.frp_95dPc[3] ? colPalette[4] :
             d >= scaleObj.frp_95dPc[3] && d < scaleObj.frp_95dPc[2] ? colPalette[3] :
             d >= scaleObj.frp_95dPc[2] && d < scaleObj.frp_95dPc[1] ? colPalette[2] :
             d >= scaleObj.frp_95dPc[1] && d < scaleObj.frp_95dPc[0] ? colPalette[1] : colPalette[0];
    };  
};

// Function to render popup content
export const popupContent = function(properties) {
    return `
    <h4 class="text-start">${properties.reg_name}</h4>
    <h6 class="text-start">2024-25 fire season anomalies from the average fire season and rankings amongst all fire seasons.</h6>
    <table class="table table-striped">
      <thead>
        <tr>
          <th class="text-start" scope="col">Variable</th>
          <th class="text-end" scope="col">%</th>
          <th class="text-end" scope="col">Rank</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-start">Burned Area Anomaly</td>
          <td class="text-end">${
            properties.ba_anom !== null ?
              properties.ba_anom > 0 ? `+${properties.ba_anom}` : properties.ba_anom
              : `Insufficient Data`
          }</td>
          <td class="text-end">${
            properties.ba_rank !== null ? properties.ba_rank : "n/a"
          }</td>
        </tr>
        <tr>
          <td class="text-start">Carbon Emitted Anomaly</td>
          <td class="text-end">${
            properties.cem_emAn !== null ?
            properties.cem_emAn > 0 ? `+${properties.cem_emAn}` : properties.cem_emAn
            : `Insufficient Data`
          }</td>
          <td class="text-end">${
            properties.cem_emRk !== null ? properties.cem_emRk : "n/a"
          }</td>
        </tr>
        <tr>
          <td class="text-start">Number of Fires Anomaly</td>
          <td class="text-end">${
            properties.gfa_nFAnP !== null ?
            properties.gfa_nFAnP > 0 ? `+${properties.gfa_nFAnP}` : properties.gfa_nFAnP
            : `Insufficient Data`
          }</td>
          <td class="text-end">${
            properties.gfa_nFRk !== null ? properties.gfa_nFRk : "n/a"
          }</td>
        </tr>
        <tr>
          <td class="text-start">95ᵗʰ Percentile Fire Size Anomaly</td>
          <td class="text-end">${
            properties.gfa_95FAP !== null ?
            properties.gfa_95FAP > 0 ? `+${properties.gfa_95FAP}` : properties.gfa_95FAP
            : `Insufficient Data`
          }</td>
          <td class="text-end">${
            properties.gfa_95FRk !== null ? properties.gfa_95FRk : "n/a"
          }</td>
        </tr>
        <tr>
          <td class="text-start">95ᵗʰ Percentile Rate of Growth Anomaly</td>
          <td class="text-end">${
            properties.gfa_95RAP !== null ?
            properties.gfa_95RAP > 0 ? `+${properties.gfa_95RAP}` : properties.gfa_95RAP
            : `Insufficient Data`
          }</td>
          <td class="text-end">${
            properties.gfa_95RRk !== null ? properties.gfa_95RRk : "n/a"
          }</td>
        </tr>
        <tr>
          <td class="text-start">Average Fire's 95ᵗʰ Percentile FRP Anomaly</td>
          <td class="text-end">${
            properties.frp_95dPc !== null ?
            properties.frp_95dPc > 0 ? `+${properties.frp_95dPc}` : properties.frp_95dPc
            : `Insufficient Data`
          }</td>
          <td class="text-end">${
            properties.frp_95r !== null ? properties.frp_95r : "n/a"
          }</td>
        </tr>
      </tbody>
    </table>
    `;
};