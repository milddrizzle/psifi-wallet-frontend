import { ApexOptions } from "apexcharts";

export const options: ApexOptions = {
  stroke: {
    curve: "smooth", // or 'straight'
    width: 2,
    colors: ["#18f135"], // Change the color of the graph line
  },
  chart: {
    id: "trades",
    type: "area",
    height: 300,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    background: "transparent", // Set background to transparent
    dropShadow: {
      enabled: false, // Disable drop shadow
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "category",
    axisBorder: {
      show: false,
    },
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  grid: {
    show: false,
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  fill: {
    type: "gradient",
    colors: ["#99EA92", "#99EA92", "transparent", "transparent", "transparent"],
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
};
