import { Alchemy } from './alchemy.js';

Alchemy.prototype.getBday = () => {
  let d2 = new Date(new Date().getFullYear(), 3, 5);
  let d3 = new Date();
  d3.setHours(0, 0, 0, 0);

  if (d3 > d2) d2 = new Date(new Date().getFullYear() + 1, 3, 5);

  let days = Math.round((d2 - d3) / (1000 * 60 * 60 * 24));
  
  return {
    d: days == 0 ?  "Happy birthday" : `Waiting for ${days} day/s`,
  };
};

Alchemy.prototype.schedule = async (fun, runNow = true) => {
  if (runNow) fun();
  setInterval(fun, TIME_MINUTE);
};

Alchemy.prototype.ghostsAppaerance = async () => {
  let response = await fetch(`/public/report.json`);
  const json = await response.json();

  for (const visitor of json.visitors.data) {
    return visitor.visitors.count;
  };
};
