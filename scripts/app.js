if (!window.app) {
  window.app = {
    Load: _Load,
    GetStockPrices: _GetStockPrices,
    RenderPrices: _RenderPrices,
    RenderGraph: _RenderGraph,
    Prices: {
      'MSFT': []
    }
  };
}

// Form submit
$('#go').click(() => {
  app.GetStockPrices($("#stockTicker").val());
});

function _Load() {
  app.GetStockPrices("MSFT");
}

function _GetStockPrices(ticker) {
  var formattedTicker = ticker.toUpperCase(); // Keep stock symbol format consistent
  var urlTemplate = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker}&apikey=ES0RLUA5ZTYI9VFC";
  var urlToFetch = urlTemplate.replace("{ticker}", formattedTicker);

  // Add our new stock symbol to app.Prices
  if (!app.Prices[formattedTicker]) {
    app.Prices[formattedTicker] = [];
  }

  $.getJSON({
    url: urlToFetch, success: function (result) {
      var fetchedPrices = result["Time Series (Daily)"];

      for (var p in fetchedPrices) {
        app.Prices[formattedTicker].push({ "DateOfPrice": p, ClosePrice: fetchedPrices[p]["4. close"] });
      }

      app.RenderPrices(app.Prices[formattedTicker]);
      app.RenderGraph(app.Prices[formattedTicker]);
    }
  });
}

function _RenderPrices(listOfPrices) {
  var rows = [];
  for (var i = 0; i < listOfPrices.length; i++) {
    rows.push(React.createElement(StockPriceRow, listOfPrices[i]));
  }
  ReactDOM.render(
    rows,
    document.getElementById('priceList')
  );
}

function _RenderGraph(prices) {
  var closePrices = prices.map(item => item.ClosePrice);
  var dates = prices.map(item => item.DateOfPrice);
  var trace = {
    x: dates,
    y: closePrices
  }

  Plotly.newPlot('priceGraph', [trace]);
}

class StockPriceRow extends React.Component {
  render() {
    var cells = [];
    var priceElement = React.createElement("td", null, this.props.DateOfPrice);
    cells.push(priceElement);
    var dateElement = React.createElement("td", null, this.props.ClosePrice);
    cells.push(dateElement);
    return React.createElement('tr', null, cells);
  }
}

$(app.Load());