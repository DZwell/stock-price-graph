import { getStockPrices } from './app';

let goButton = document.getElementById('go-button');
let stockSymbolField = document.getElementById('stock-ticker');

document.addEventListener('DOMContentLoaded', () => {
  getStockPrices("MSFT");
}, false);

const getElementValue = el => el.value;

const handleGetStockPricesEvent = ({ keyCode, type }) => {
  if ((type === 'keydown' && keyCode === 13) || type === 'click') {
      getStockPrices(getElementValue(stockSymbolField))        
  }
};

goButton.addEventListener('click', handleGetStockPricesEvent, false);
stockSymbolField.addEventListener('keydown', handleGetStockPricesEvent, false);