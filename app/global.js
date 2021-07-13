global.logger = console;
global.baseUrl = '/v1';
global.promise = () => {
  const prom = {};
  prom.pending = new Promise((...args) => [prom.resolve, prom.reject] = args);
  return prom;
};
// eslint-disable-next-line
Object(Date).prototype.toLocaleString = function () {
  const dt = this;
  const d = {
    Y: dt.getFullYear(),
    m: `0${dt.getMonth() + 1}`.slice(-2),
    d: `0${dt.getDate()}`.slice(-2),
    H: `0${dt.getHours()}`.slice(-2),
    M: `0${dt.getMinutes()}`.slice(-2),
    S: `0${dt.getSeconds()}`.slice(-2),
  };
  return `${d.Y}-${d.m}-${d.d} ${d.H}:${d.M}:${d.S}`;
};
