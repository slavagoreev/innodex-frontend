import { ApexOptions } from 'apexcharts';

const generateNextStockPrice = (oldPrice: number, volatility = 0.02) => {
  // generate number, 0 <= x < 1.0
  const rnd = Math.random();
  let changePercent = 2 * volatility * rnd;

  if (changePercent > volatility) changePercent -= 2 * volatility;

  const changeAmount = oldPrice * changePercent;

  return oldPrice + changeAmount;
};

export const generateStockPrice = (length = 100, volatility = 0.02) => {
  let currentPrice = Math.random() * 10000;
  const range = new Array(length);
  const prices = [currentPrice];

  for (let i = 0; i < length - 1; i++) {
    currentPrice = generateNextStockPrice(currentPrice, volatility);
    prices.push(currentPrice);
    range[i] = i;
  }

  return [range, prices];
};

export const defaultChartOptions: ApexOptions = {
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  stroke: {
    width: 2,
    curve: 'smooth',
    colors: ['#cf3a51'],
  },
  fill: {
    type: 'gradient',
    colors: ['#cf3a51'],
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      type: 'vertical',
      gradientToColors: ['#cf3a51'],
      stops: [0, 90, 100],
    },
  },
  chart: {
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: true,
    },
    animations: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    selection: {
      enabled: false,
    },
  },
  markers: {
    size: 0,
  },
};
