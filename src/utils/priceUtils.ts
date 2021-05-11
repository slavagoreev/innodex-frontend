export function eToNumber(num: string | number) {
  let sign = '';

  (num = String(num)).charAt(0) === '-' && ((num = num.substring(1)), (sign = '-'));
  const arr = num.split(/[e]/gi);

  if (arr.length < 2) return sign + num;

  const dot = (0.1).toLocaleString().substr(1, 1);
  let n = arr[0];
  const exp = Number(arr[1]);
  let w = (n = n.replace(/^0+/, '')).replace(dot, '');
  const pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp;
  const L = pos - w.length;
  const s = `${BigInt(w)}`;

  w =
    exp >= 0
      ? L >= 0
        ? s + '0'.repeat(L)
        : r()
      : pos <= 0
      ? `0${dot}${'0'.repeat(Math.abs(pos))}${s}`
      : r();

  if (!Number(w)) return sign + 0;

  return sign + w;

  function r() {
    return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`);
  }
}

export const weiToPrice = (price: number) => {
  return eToNumber(price / 10 ** 13);
};

export const formatPrice = (price: number, precision = 5) => {
  return price.toFixed(precision).replace(/(\.0*|(?<=(\..*))0*)$/, '');
};
