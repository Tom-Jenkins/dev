// Import JS libraries
import * as echarts from "echarts";
import { colourPolygons } from "./utils";

// Array of years to plot time series
const years = [1851, 1852, 1853, 1854, 1855, 1856, 1857, 1858, 1859, 1860, 1861, 1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870, 1871, 1872, 1873, 1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

// Function to render echarts plot
export function renderChart(data, variable, scale, colPalette, ID) {

  // Select element from DOM
  const plotElement = document.getElementById(ID);

  // Initiate echarts instance locally (no global variable)
  const echartsPlot = echarts.init(plotElement, null, { renderer: "svg" });

  // Get the correct colour using function
  const colour = colourPolygons(data[variable], scale, colPalette);

  // Determine the maximum value from your data
  const maxValue = Math.max(...data[`${variable}_timeseries`]);

  // Specify the configuration items and data for the chart
  const option = {
    // title: {
    //   text: "GMST contribution",
    //   textStyle: {
    //     fontSize: 12,
    //   },
    // },
    xAxis: {
      type: "category",
      data: years,
      axisLabel: {
        interval: 170,
      },
      axisTick: {
        interval: 170,
        alignWithLabel: true,
      },
    },
    yAxis: {
      name: "Contribution to GMST",
      nameTextStyle: {
        fontSize: 12,
        align: "left"
      },
      type: "value",
      axisLabel: {
        show: false,
      },
      minInterval: maxValue / 2,
      max: maxValue,
    },
    color: colour,
    series: [
      {
        data: data[`${variable}_timeseries`],
        type: "line",
        silent: true,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        cursor: "default",
        label: {
          show: true, // Show label
          position: "top",
          // formatter: `{c}°C`, // Format to show the value
          formatter: (params) => {
            if (params.dataIndex === 0) {
              return "";
            } else {
              return `${Number(params.value).toPrecision(2)}°C`;
            };
          },
        },
      }
    ],
    grid: {
      top: "25%",
      bottom: "20%",
      left: "5%",
    },
    tooltip: {
      show: false,
    },
    // toolbox: {
    //   orient: "vertical",
    //   top: "5.5",
    //   left: "53%",
    //   itemSize: 15,
    //   itemGap: 0,
    //   iconStyle: {
    //     borderWidth: 0,
    //     color: "black",
    //     opacity: 0.90,
    //   },
    //   emphasis: {
    //     iconStyle: {
    //       borderWidth: 0,
    //       color: "#409EFF",
    //     },
    //     tooltip: {
    //       textStyle: {
    //         fontSize: 20,
    //       }
    //     }
    //   },
    //   feature: {
    //     saveAsImage: {
    //       title: "Image",
    //       icon: "M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0 M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z",
    //       name: "National-Contribution-UEA-Timeseries-Image",
    //       // pixelRatio: 10,
    //     },
    //   },
    // },
  };

  // Display the chart using the configuration options
  echartsPlot.setOption(option, true);
};