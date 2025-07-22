// Import JS libraries
import * as echarts from "echarts";
import { Modal } from "bootstrap";

// Initiate echarts variable
export let echartsPlot;

// Function to render echarts plot
export function renderPlot (timeseries, firstSelectorVal, secondSelectorVal, thirdSelectorValues) {

  // X axis (start year)
  const xaxis = Object.values(timeseries[firstSelectorVal][secondSelectorVal])[0].map( i => i["Fire Season Start Year"]);
  
  // Store all data for second selector
  const secondData = Object.values(timeseries[firstSelectorVal][secondSelectorVal]);
  // console.log(secondData, typeof secondData, secondData.length);

  // Extract the name of the active variable (e.g. if "burned" return "Burned Area (km^2)")
  const variableName = firstSelectorVal === "burned"    ? "Burned Area (km^2)" :
                       firstSelectorVal === "emissions" ? "Carbon Emitted"     :
                       firstSelectorVal === "atlas"     ? "Number of Fires"    :
                       firstSelectorVal === "fireIntensity" ? "Average Fire's 95th Percentile FRP (MW)" :
                       firstSelectorVal === "fireSize"  ? "95th Percentile Fire Size (km^2)" : "95th Percentile Rate of Growth (km^2 day^-1)";
  
  // Initialize the data series object
  const seriesData = {};

  // Populate the object with keys (choices) and values (choices data values)
  thirdSelectorValues.forEach(region => {

    // Extract data for each region
    let valueArray = [];
    secondData.forEach(arr => {
      if( region === arr[0]["Region Name"] ) {
        valueArray = arr.map(i => i[variableName].toFixed(0));
      };
    });

    // Assign properties and values
    seriesData[region] = valueArray;
  });
  // console.log(seriesData, typeof seriesData);

  // Format series data for echarts
  const seriesDataFormat = Object.keys(seriesData).map((item, index) => {
    return {
      name: item,
      type: "line",
      data: Object.values(seriesData)[index],
      symbolSize: 7, // point size
      lineStyle: {
        width: 3, // linewidth
      },
    };
  });
  // console.log(seriesDataFormat);

  // Select element from DOM
  const plotElement = document.getElementById("plot");

  // Check if echartsPlot is already initialized
  if (!echartsPlot) {
    // Initiate echarts instance
    echartsPlot = echarts.init(plotElement);
  };

  // Y axis label
  const ylabel = firstSelectorVal === "burned"    ? "Burned Area (km\u00B2)" :
                 firstSelectorVal === "emissions" ? "Megatonnes CO\u2082"    :
                 firstSelectorVal === "atlas"     ? "Number of Fires"        :
                 firstSelectorVal === "fireIntensity" ? "Average Fire's 95ᵗʰ Percentile FRP (MW)" :
                 firstSelectorVal === "fireSize"  ? "95ᵗʰ Percentile Fire Size (km\u00B2)" : "95ᵗʰ Percentile Rate of Growth (km\u00B2 per day)";

  // Specify the configuration items and data for the chart
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        axis: "x",
        label: {
          show: true
        },
      },
      extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); opacity: 0.90; text-align: start;"
    },
    legend: {
      data: seriesDataFormat.map( i => i.name ),
      type: seriesDataFormat.length < 4 ? "plain" : "scroll",
      itemWidth: 25, // width of legend symbol
      itemHeight: 10, // height of legend symbol
    },
    color: [
      "#5470C6",  // Blue
      "#91CC75",  // Green
      "#FAC858",  // Yellow
      "#EA7CCC",  // Pink
      "#73C0DE",  // Cyan
      "#3BA272",  // Teal
      "#FC8452",  // Orange
      "#9A60B4",  // Purple
      "#FF00FF"   // Magenta
    ],
    grid: {
      left: "1%",
      right: "5%",
      bottom: "10%",
      top: "12%",
      containLabel: true
    },
    toolbox: {
      orient: "vertical",
      top: "10%",
      right: "0",
      itemSize: 21,
      itemGap: 16,
      iconStyle: {
        borderWidth: 0,
        color: "black",
        opacity: 0.90,
      },
      emphasis: {
        iconStyle: {
          borderWidth: 0,
          color: "#409EFF",
        }
      },
      feature: {
        myFeatureGlobal: {
          show: firstSelectorVal === "burned" || firstSelectorVal === "emissions" ? true : false,
          title: "Toggle global layer",
          icon: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z",
          onclick: () => { toggleGlobalLayer(timeseries, firstSelectorVal, variableName) },
        },
        // restore: { 
        //   title: "Reset chart",
        //   icon: "M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9 M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z",
        // },
        dataView: {
          readOnly: true,
          title: "Data view",
          icon: "M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5 M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z",
          buttonColor: "#02b3ca",
          lang: ["Copy and Paste into Spreadsheet Software", "Close", "Refresh"],
        },
        saveAsImage: {
          title: "Download image",
          icon: "M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0 M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z",
          name: "State-of-Wildfires-timeseries-image",
          pixelRatio: 10,
        },
        myFeatureInfo: {
          title: "More information",
          icon: "m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0",
          onclick: () => {
             const infoModal = new Modal(document.getElementById("info-modal"), {
              keyboard: false
            });
            infoModal.show();
          }
        },
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xaxis,
      name: "Fire Season Start Year",
      nameTextStyle: {
        fontSize: 15,
      },
      nameLocation: "center",
      nameGap: 35,
    },
    yAxis: {
      type: "value",
      name: ylabel,
      // nameLocation: "center",
      // nameGap: 100,
      nameTextStyle: {
        fontSize: 15,
        align: "left"
      }
    },
    series: seriesDataFormat,
    graphic: {
      type: "image",
      left: "right",
      top: "bottom",
      style: {
        image: "data:image/svg+xml;base64," + btoa(`
          <svg width="100%" height="100%" viewBox="0 0 1963 1184" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g><path d="M481.442,886.217c-10.679,-0 -3.421,-0.279 -13.421,-0.279c-123.821,-0 -216.754,-85.088 -216.754,-323.28l-0,-351.079c-0,-120.362 53.266,-166.041 128.541,-166.041l0,-14.321l-379.808,-0l0,14.146c66.008,1.27 89.863,57.379 89.863,131.166l-0,346.059c-0,260.729 124.825,378.454 351.108,378.454l40.437,-0l0.034,-14.825Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1244.58,644.079c-1.458,-130.675 -30.937,-158.783 -161.441,-160.05l-0,-12.916c130.504,-1.288 159.983,-29.325 161.441,-160.021l12.292,-0c1.513,130.696 30.921,158.646 161.425,159.916l0,13.021c-130.504,1.267 -159.912,29.375 -161.425,160.05l-12.292,0Z" style="fill:#00aeef;fill-rule:nonzero;"/><path d="M544.238,886.304c118.124,0 170.087,-80.192 170.087,-193.525c0,-135.766 0,0 0,0l-0.125,-492.866c0,-115.763 -57.983,-154.271 -128.313,-154.271l-0.054,-14.463l670.904,0l0.292,182.084l-11.891,-0.034c-20.034,-107.029 -61.771,-148.837 -197.9,-148.837l-31.542,-0c-128.021,-0 -153.179,40.816 -153.179,155.4l-0,106.562c-0,138.925 56.721,144.638 163.629,144.638l-0,13.021c-106.908,-0 -163.629,11.645 -163.629,151.924l-0,45.609c-0,171.858 21.683,183.279 166.112,183.279c85.379,-0 189.463,-21.875 216.217,-139.671l12.204,0.054l0,175.834l-712.812,-0l-0,-14.738Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1495.75,886.217c117.933,-0 147.725,-76.146 94.271,-195.609l-180.729,-451.979l52.22,-223.541l9.95,-0.038c0,0 248.525,590.104 310.175,709.5c65.05,126.004 119.721,161.754 173.646,161.754l0,14.738l-459.533,-0l-0,-14.825Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M138.158,1152.17c-31.129,-0 -49.737,-22.413 -49.737,-59.95l-0,-76.788l19.167,0l-0,75.817c-0,28.158 12.795,40.85 30.937,40.85c18.054,0 30.4,-12.342 30.4,-39.879l-0,-76.788l19.167,0l-0,75.625c-0,38.246 -18.667,61.113 -49.934,61.113Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M286.738,1149.12l-18.717,-0l-0,-59.621c-0,-16.858 -7.067,-25.796 -19.167,-25.796c-12.692,0 -22.692,10.138 -22.692,26.996l0,58.421l-18.679,-0l0,-102.363l17.588,0l-0,14.446c5.987,-11.062 15.45,-16.583 27.462,-16.583c20.767,-0 34.205,16.162 34.205,41.233l-0,63.267Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M329.217,1034.51l-18.438,-0l0,-18.921l18.438,-0l-0,18.921Zm0.158,114.604l-18.679,-0l-0,-102.363l18.679,0l0,102.363Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M396.546,1149.86l-16.513,-0.001l-36.683,-103.108l19.792,0l25.175,76.7l25.329,-76.7l19.446,0l-36.546,103.108Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M457.188,1089.69l47.516,-0.001c-1.612,-15.295 -9.392,-27.308 -23.404,-27.308c-13.313,0 -22.533,12.446 -24.113,27.308Zm26.092,61.755c-26.283,-0 -45.433,-22.971 -45.433,-53.421c-0,-30.45 19.012,-53.404 43.767,-53.404c24.758,-0 42.137,21.754 42.137,54.166c0,1.392 0,2.971 -0.175,5.334l-0.087,2.204l-66.18,-0c2.084,18.437 13.475,27.604 26.305,27.604c8.312,-0 17.254,-3.454 25,-12.829l0.745,-0.871l10.259,10.262l0.816,0.834l-0.712,0.954c-9.513,13.108 -21.509,19.167 -36.442,19.167Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M558.629,1149.12l-18.387,-0l-0,-102.363l17.954,0l-0,21.963c6.196,-15.904 17.15,-23.734 30.675,-23.734c0.537,0 2.587,0.071 2.587,0.071l0,21.996l-2.083,0c-16.858,0 -30.746,13.229 -30.746,41.004l0,41.063Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M632.013,1151.01c-11.371,0 -24.217,-4.637 -34.08,-13.891l-0.795,-0.709l8.399,-14.62l0.905,0.783c9.425,8.158 17.741,11.421 27.445,11.421c10.055,-0 15.955,-4.792 15.955,-12.621c-0,-8.196 -6.334,-11.108 -18.105,-14.913c-12.412,-4.062 -29.395,-9.966 -29.395,-31.233c-0,-17.95 14.691,-30.208 32.625,-30.208c10.658,-0 21.041,3.125 30.225,10.137l0.883,0.646l-7.583,15.363l-0.905,-0.713c-8.195,-6.129 -17.395,-8.421 -23.42,-8.421c-9.2,0 -14.721,4.879 -14.721,11.271c-0,8.071 5.121,10 20.362,14.721c16.771,5.208 27.067,14.846 27.067,31.425c-0,19.042 -14.375,31.562 -34.863,31.562Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M805.746,1180.55c-12.484,0 -24.342,-8.646 -24.342,-8.646l6.25,-17.187c0,-0 9.638,7.171 17.05,7.171c9.967,-0 14.517,-6.234 18.142,-16.65l-38.942,-98.488l20.246,0l27.742,73.125l22.708,-73.125l19.725,0l-36.912,104.842c-7.084,18.612 -17.43,28.958 -31.25,28.958" style="fill:#231f20;fill-rule:nonzero;"/><path d="M949.704,1062.9c-14.446,0 -27.604,13.142 -27.604,34.442c0,21.425 13.3,35.108 27.933,35.108c14.584,0 27.867,-13.179 27.867,-34.325c0,-19.496 -12.204,-35.192 -28.196,-35.192m0,88.213c-25.729,-0 -46.612,-23.317 -46.612,-53.021c-0,-30.346 21.025,-53.783 46.941,-53.783c25.817,-0 46.98,23.279 46.98,53c-0,30.316 -21.284,53.804 -47.309,53.804Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1034.36,1149.01l-18.975,0l0,-83.85l-11.895,0l-0,-18.508l11.895,0l0,-6.65c0,-24.967 19.2,-30.05 28.071,-30.05c6.684,0 11.079,1.196 14.584,2.621l0.729,0.292l-0,18.524l-0.938,-0.45c-2.741,-1.387 -7.466,-2.466 -10.591,-2.466c-9.375,-0 -13.055,5.262 -13.055,13.716l0,4.655l24.392,-0l0,18.316l-24.217,0l0,83.85Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1188.54,1148.96l-82.5,0l-0,-133.75l81.666,0l0,19.321l-62.204,0l0,34.759l54.688,-0l-0,19.308l-54.688,-0l0,41.229l63.038,0l-0,19.133Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1218.17,1117.28c0,10.571 7.675,16.042 17.642,16.042c15.779,-0 24.758,-11.425 24.758,-24.513l0,-5.591c-4.204,-2.534 -11.65,-4.325 -19.671,-4.325c-11.425,-0 -22.729,5.729 -22.729,18.387Zm15.108,33.504c-16.562,0 -34.045,-10.537 -34.045,-33.021c-0,-21.612 15.795,-36.229 39.67,-36.229c9.2,0 16.821,1.996 21.284,3.871l-0,-1.425c-0,-10.746 -5.488,-20.779 -20.4,-20.779c-10.696,-0 -20.834,3.871 -28.975,9.25l-1.042,0.696l-5.4,-17.588l0.883,-0.675c8.005,-5.242 21.234,-10.137 34.896,-10.137c12.329,-0 22.659,3.937 29.1,11.387c6.284,7.275 9.688,17.154 9.688,30.242l-0,62.587l-16.392,0l0,-12.966c-3.679,6.995 -14.458,14.787 -29.267,14.787Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1543.33,1095.87l-20.712,-52.654l-20.642,52.708l41.354,-0.054Zm40.675,53.091l-20.829,0l-12.658,-33.8l-55.659,0l-12.675,33.8l-20.591,0l53.7,-133.558l15.016,0l53.696,133.558Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1732.43,1063.17c-13.504,0 -25.121,10.558 -25.121,29.292c0,18.733 12.067,30.104 25.121,30.104c14.742,-0 27.379,-11.946 27.379,-29.533c0,-20.746 -13.8,-29.863 -27.379,-29.863Zm0.159,117.05c-14.825,0 -28.23,-4.737 -39.93,-14.133l-0.816,-0.659l8.071,-16.858l0.975,0.854c9.825,8.296 20.812,12.5 32.62,12.5c19.271,0 28.109,-13.458 28.109,-31.25l-0,-8.108c-5.942,12.567 -18.65,18.646 -31.671,18.646c-20.521,-0 -41.771,-17.938 -41.771,-47.954c0,-30.709 21.25,-48.784 41.771,-48.784c13.058,0 26.337,6.267 32.675,17.725l-0,-15.625l16.633,0l0,83.734c0,15.329 -3.854,27.516 -11.371,36.233c-7.762,8.942 -20.975,13.679 -35.295,13.679Z" style="fill:#231f20;fill-rule:nonzero;"/><rect x="1800.14" y="1015.49" width="18.679" height="133.471" style="fill:#231f20;"/><path d="M757.742,1150.95c-16.404,0 -26.404,-10.487 -26.404,-29.479l-0,-55.938l-12.034,0.001l0,-18.734l11.771,-0.016l-0.017,-28.35l19.063,-0l-0,28.404l25.296,-0l-0,18.696l-25.296,-0l-0,50.991c-0,9.634 3.212,15.329 11.321,15.329c4.271,0 8.437,-1.025 11.546,-2.85l1.562,-0.866l-0.071,18.058l-0.696,0.346c-4.979,3.004 -10.104,4.408 -16.041,4.408Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1408.56,1150.62c-16.441,0 -26.441,-10.487 -26.441,-29.446l-0,-55.954l-12.03,-0l0,-18.525l11.684,-0.017l-0.034,-28.591l19.151,-0l-0,28.416l25.291,0l0,18.717l-25.291,-0l-0,50.992c-0,9.6 3.225,15.291 11.354,15.291c4.271,0 8.416,-0.971 11.541,-2.829l1.563,-0.867l0.037,18.075l-0.816,0.346c-4.984,3.005 -10.105,4.392 -16.009,4.392Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1673.05,1149.03l-18.712,0l-0,-59.583c-0,-16.875 -7.067,-25.817 -19.167,-25.817c-12.708,0 -22.692,10.138 -22.692,26.979l0,58.421l-18.7,0l0,-102.346l17.588,0l-0,14.446c5.991,-11.079 15.471,-16.579 27.45,-16.579c20.796,0 34.233,16.163 34.233,41.229l0,63.25Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M703.263,1034.57l-18.455,-0l0,-18.925l18.455,-0l-0,18.925Zm0.174,114.791l-18.716,0l-0,-102.57l18.716,-0l0,102.57Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1859.42,1034.64l-18.471,-0l0,-18.942l18.471,-0l0,18.942Zm0.158,114.27l-18.679,0l0,-102.362l18.679,-0l0,102.362Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1325.68,1150.61c-11.391,0 -24.221,-4.67 -34.083,-13.908l-0.796,-0.708l8.4,-14.654l0.921,0.816c9.412,8.175 17.725,11.442 27.433,11.442c10.05,-0 15.971,-4.792 15.971,-12.625c0,-8.208 -6.354,-11.146 -18.142,-14.946c-12.395,-4.063 -29.375,-9.983 -29.375,-31.2c0,-17.967 14.671,-30.225 32.605,-30.225c10.691,0 21.041,3.108 30.241,10.138l0.867,0.662l-7.567,15.313l-0.904,-0.68c-8.212,-6.125 -17.396,-8.4 -23.437,-8.4c-9.2,0 -14.705,4.842 -14.705,11.25c0,8.071 5.121,9.984 20.363,14.705c16.754,5.208 27.067,14.858 27.067,31.458c-0,19.008 -14.392,31.562 -34.859,31.562Z" style="fill:#231f20;fill-rule:nonzero;"/><path d="M1894.6,1117.69c0,10.591 7.692,16.025 17.638,16.025c15.783,-0 24.775,-11.409 24.775,-24.5l-0,-5.571c-4.2,-2.554 -11.646,-4.304 -19.688,-4.304c-11.387,-0 -22.725,5.691 -22.725,18.35Zm15.104,33.508c-16.546,-0 -34.046,-10.521 -34.046,-33.004c0,-21.617 15.85,-36.217 39.688,-36.217c9.166,0 16.825,1.963 21.287,3.871l0,-1.442c0,-10.746 -5.487,-20.779 -20.416,-20.779c-10.696,0 -20.834,3.871 -28.975,9.254l-1.063,0.675l-5.396,-17.587l0.9,-0.642c8.004,-5.279 21.234,-10.137 34.913,-10.137c12.312,-0 22.658,3.887 29.116,11.354c6.25,7.275 9.65,17.15 9.65,30.241l0,62.292l-16.387,0l-0,-12.654c-3.679,6.996 -14.463,14.775 -29.271,14.775Z" style="fill:#231f20;fill-rule:nonzero;"/></g>
          </svg>
        `),
        width: 45,
        height: 30,
      },
      cursor: "auto",
    },
  };
      
  // Display the chart using the configuration options
  echartsPlot.setOption(option, true);
};

// ---------- //
// Additional functions
// ---------- //

// Function to toggle global layer on chart
function toggleGlobalLayer (timeseries, firstSelectorVal, variableName) {
  
  // Get current options
  const currentOption = echartsPlot.getOption();

  // Check if the global series is already present on chart
  const isGlobalSeries = currentOption.series.map(i => i.name).includes("Global");
  // console.log(isGlobalSeries)

  // If global series already exists then remove series and legend from chart
  if (isGlobalSeries) {
    const idxGlobal = currentOption.series.map( i => i.name).indexOf("Global");
    currentOption.series.splice(idxGlobal, 1);
    const idxGlobalLegend = currentOption.legend[0].data.indexOf("Global");
    currentOption.legend[0].data.splice(idxGlobalLegend, 1);
  } else {

    // Global series data
    const globalData = Object.values(timeseries[firstSelectorVal]["Global"])[0].map(i => i[variableName]);
    
    // Add series to chart
    const globalSeries = {
      name: "Global",
      type: "line",
      data: globalData,
      lineStyle: {
        width: 3,
      },
    };

    // Update legend data
    currentOption.legend[0].data.push(globalSeries.name);

    // Update series data
    currentOption.series.push(globalSeries); 
  };

  // Apply the updated options
  echartsPlot.setOption(currentOption, { notMerge: true });
};
