if (!window.app) {
  window.app = {
    load,
    getStockPrices,
    renderPrices,
    renderGraph,
    prices: {
      'MSFT': []
    }
  };
}

$("#stock-ticker").keyup(function (event) {
  if (event.keyCode === 13) {
    $("#go").click();
  }
});

$('#go').click(() => {
  app.getStockPrices($("#stock-ticker").val());
});


function load() {
  app.getStockPrices("MSFT");
}

function getStockPrices(ticker) {
  const formattedTicker = ticker.toUpperCase(); // Keep stock symbol format consistent
  const urlToFetch = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=ES0RLUA5ZTYI9VFC`;

  if (app.prices[formattedTicker] && app.prices[formattedTicker].length > 0) {
    app.renderPrices(app.prices[formattedTicker]);
    app.renderGraph(app.prices[formattedTicker]);
  } else {
    app.prices[formattedTicker] = [];

    $.getJSON({
      url: urlToFetch, success: (result) => {
        const fetchedPrices = result["Time Series (Daily)"];
        console.log(fetchedPrices);

        for (let p in fetchedPrices) {
          app.prices[formattedTicker].push({
            dateOfPrice: p,
            open: fetchedPrices[p]["1. open"],
            high: fetchedPrices[p]["2. high"],
            low: fetchedPrices[p]["3. low"],
            close: fetchedPrices[p]["4. close"],
          });
        }

        app.renderPrices(app.prices[formattedTicker]);
        app.renderGraph(app.prices[formattedTicker]);
      }
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

$(app.load());