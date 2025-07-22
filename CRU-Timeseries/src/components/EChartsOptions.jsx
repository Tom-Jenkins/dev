function capitaliseWords(str) {
  return str
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join("-"),
    )
    .join(" ");
}

const [blue, purple, red, yellow, green, grey] = [
  "#1447e6",
  "#c800de",
  "#ec003f",
  "#ffa000",
  "#00bc7d",
  "#171717",
];

function seasonColour(str) {
  switch (str) {
    case "DJF":
      return purple;
    case "JJA":
      return yellow;
    case "MAM":
      return red;
    case "SON":
      return green;
    default:
      return blue;
  }
}

export default function option(
  yearsArray,
  dataArray,
  variable,
  country,
  season,
) {
  // Check if all data values are "No Data"
  const allNoData = dataArray.every((val) => val === "No Data");
  // console.log(allNoData);

  const option = {
    xAxis: {
      type: "category",
      // name: "Year",
      // name: "",
      data: yearsArray,
      // axisLabel: {
      //   showMaxLabel: true,
      // },
    },

    yAxis: {
      type: "value",
      // name: "oC",
      min: "dataMin",
      max: "dataMax",
    },

    series: !allNoData
      ? [
          {
            data: dataArray,
            type: "line",
            symbol: "none",
            cursor: "pointer",
          },
        ]
      : [],

    graphic: {
      ignore: !allNoData ? true : false,
      type: "text",
      left: "center",
      top: "center",
      style: {
        text: "No Data Available",
        fontSize: 22,
        // fontWeight: "bold",
        fill: grey,
      },
    },

    grid: {
      top: 75, // padding between chart and subtitle
      bottom: 80,
      left: 40,
      right: window.innerWidth < 640 ? 10 : 40, // 2024 label spacing on dataView
    },

    color: seasonColour(season),

    title: {
      text: `${season} ${capitaliseWords(variable)}`,
      textStyle: {
        color: grey,
        fontSize: 17,
      },
      subtext: `${country}`,
      subtextStyle: {
        color: grey,
        fontSize: 15,
      },
    },

    tooltip: {
      show: !allNoData ? true : false,
      trigger: "axis",
      axisPointer: {
        type: "line",
        axis: "x",
        label: {
          show: true,
        },
        // formatter: function (params) {},
      },
      // extraCssText:
      //   "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); opacity: 0.90; text-align: start;",
    },

    dataZoom: [
      {
        type: "slider",
        realtime: true,
        brushSelect: false,
        start: 0,
        end: 100,
        height: 35,
        bottom: 5,
        textStyle: {
          fontWeight: "bold",
        },
      },
    ],
  };
  // console.log(option);
  return option;
}
