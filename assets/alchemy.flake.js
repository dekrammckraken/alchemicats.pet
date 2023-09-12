import { Alchemy } from './alchemy.js';

Alchemy.prototype.getFlake = async (name) => {
    const response = await fetch(`leaf/${name}.html`);
    const page = await response.text();
    return page;
};