import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request';

const PRICES = {
  'MSFT': []
}

let goButton = window.document.getElementById('go-button');
let stockSymbolField = window.document.getElementById('stock-ticker');

goButton.addEventListener('click', (event) => {
  getStockPrices(stockSymbolField.value);
});

stockSymbolField.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    getStockPrices(stockSymbolField.value);
  }
});

function getStockPrices(ticker) {
  const formattedTicker = ticker.toUpperCase(); // Keep stock symbol format consistent
  const urlToFetch = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=ES0RLUA5ZTYI9VFC`;

  if (PRICES[formattedTicker] && PRICES[formattedTicker].length > 0) {
    renderPrices(PRICES[formattedTicker]);
    renderGraph(PRICES[formattedTicker]);
  } else {
    PRICES[formattedTicker] = [];

    request(urlToFetch, (error, response, body) => {
      const jsonBody = JSON.parse(body);
      const fetchedPrices = jsonBody["Time Series (Daily)"];
  
      for (let p in fetchedPrices) {
  
        PRICES[formattedTicker].push({
          dateOfPrice: p,
          open: fetchedPrices[p]["1. open"],
          high: fetchedPrices[p]["2. high"],
          low: fetchedPrices[p]["3. low"],
          close: fetchedPrices[p]["4. close"],
        });
      }
  
      renderPrices(PRICES[formattedTicker]);
      renderGraph(PRICES[formattedTicker]);
    });
  }
}

function renderPrices(listOfPrices) {
  const rows = [];
  for (let i = 0; i < listOfPrices.length; i++) {
    rows.push(React.createElement(StockPriceRow, listOfPrices[i]));
  }
  ReactDOM.render(
    rows,
    document.getElementById('price-list')
  );
}

function renderGraph(prices) {
  const dates = [];
  const closePrice = [];
  const openPrice = [];
  const priceLow = [];
  const priceHigh = [];

  prices.forEach(item => {
    dates.push(item.dateOfPrice);
    closePrice.push(item.close);
    openPrice.push(item.open);
    priceLow.push(item.low);
    priceHigh.push(item.high);
  });

  const high = {
    x: dates,
    y: priceHigh,
    name: 'High',
    mode: 'lines+markers'
  }

  const low = {
    x: dates,
    y: priceLow,
    name: 'Low',
    mode: 'lines+markers'
  }

  const close = {
    x: dates,
    y: closePrice,
    name: 'Close',
    mode: 'lines+markers'
  }

  const open = {
    x: dates,
    y: openPrice,
    name: 'Open',
    mode: 'lines+markers'
  }

  Plotly.newPlot('price-graph', [high, low, open, close]);
}

class StockPriceRow extends React.Component {
  render() {
    const cells = [];
    const priceElement = React.createElement("td", null, this.props.dateOfPrice);
    cells.push(priceElement);
    const dateElement = React.createElement("td", null, this.props.close);
    cells.push(dateElement);
    return React.createElement('tr', null, cells);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getStockPrices("MSFT");
}, false);

export default {
  getStockPrices,
  renderPrices,
  renderGraph,
  PRICES
}