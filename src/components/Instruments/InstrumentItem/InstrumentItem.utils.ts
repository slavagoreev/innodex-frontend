import { ApexOptions } from 'apexcharts';

const generateNextStockPrice = (oldPrice: number, volatility = 0.02) => {
  // generate number, 0 <= x < 1.0
  const rnd = Math.random();
  let changePercent = 2 * volatility * rnd;

  if (changePercent > volatility) changePercent -= 2 * volatility;

  const changeAmount = oldPrice * changePercent;

  return oldPrice + changeAmount;
};

export const generateStockPrice = (
  name: string,
  initialPrice: number,
  length = 100,
  volatility = 0.02
) => {
  const savedResult = localStorage.getItem(`chart_${name}`);

  if (name && savedResult) {
    return JSON.parse(savedResult);
  }

  let currentPrice = initialPrice;
  const range = new Array(length);
  const prices = [currentPrice];
  const today = new Date().getTime();

  for (let i = 0; i < length - 1; i++) {
    currentPrice = generateNextStockPrice(currentPrice, volatility);
    prices.push(currentPrice);
    range[i] = today - i * 60 * 1000;
  }

  const result = [range, prices.reverse()];

  localStorage.setItem(`chart_${name}`, JSON.stringify([range, prices.reverse()]));

  return result;
};

export const getStyledChartOptions = (color = '#cf3a51'): ApexOptions => ({
  stroke: {
    width: 2,
    curve: 'smooth',
    colors: [color],
  },
  fill: {
    type: 'gradient',
    colors: [color],
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      type: 'vertical',
      gradientToColors: [color],
      stops: [0, 90, 100],
    },
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: false,
  },
});

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
};
