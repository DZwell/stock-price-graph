// var LineGraph;
// import('./components/LineGraph.jsx').then((result) => {
//     LineGraph = result;
// });

if (!window.app) {
  window.app = {
    Load: _Load,
    GetStockPrices: _GetStockPrices,
    RenderPrices: _RenderPrices,
    RenderGraph: _RenderGraph,
    Prices: []
  };
}

function _Load() {
  var prices = app.GetStockPrices($("#stockTicker").val());
}

function _GetStockPrices(ticker) {
  console.log(ticker, 'ticker');
  var urlTemplate = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker}&apikey=ES0RLUA5ZTYI9VFC";
  var urlToFetch = urlTemplate.replace("{ticker}", ticker);
  console.log(urlToFetch);
  var fetchedPrices;
  $.getJSON({
    url: urlToFetch, success: function (result) {
      fetchedPrices = result["Time Series (Daily)"];
      //normalize the price JSON we get back from the API.
      for (var p in result["Time Series (Daily)"]) {
        app.Prices.push({ "DateOfPrice": p, ClosePrice: fetchedPrices[p]["4. close"] });
      }
      app.RenderPrices(app.Prices);
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

  
  app.RenderGraph(app.Prices);
}

function _RenderGraph(prices) {
  const closePrices = prices.map(item => item.ClosePrice);
  const dates = prices.map(item => item.DateOfPrice);
  const trace = {
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