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

$("#stock-ticker").keyup(function(event) {
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
  var formattedTicker = ticker.toUpperCase(); // Keep stock symbol format consistent
  var urlTemplate = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker}&apikey=ES0RLUA5ZTYI9VFC";
  var urlToFetch = urlTemplate.replace("{ticker}", formattedTicker);

  if (app.prices[formattedTicker] && app.prices[formattedTicker].length > 0) {
    app.renderPrices(app.prices[formattedTicker]);
    app.renderGraph(app.prices[formattedTicker]);
  } else {
    app.prices[formattedTicker] = [];

    $.getJSON({
      url: urlToFetch, success: function (result) {
        var fetchedPrices = result["Time Series (Daily)"];
        console.log(fetchedPrices);

        for (var p in fetchedPrices) {
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
  var rows = [];
  for (var i = 0; i < listOfPrices.length; i++) {
    rows.push(React.createElement(StockPriceRow, listOfPrices[i]));
  }
  ReactDOM.render(
    rows,
    document.getElementById('price-list')
  );
}

function renderGraph(prices) {
  //   var traceObject = {
  //     dates: [],
  //     close: [],
  //     open: [],
  //     low: [],
  //     hight: []
  //   };

  //   for (var i = 0; i < prices.length; i++) { 

  //   }

  //   var lines = prices.map((item) => {

  //     if (! traceObject[item]) {
  //       traceObject[key] = prices.map(item => item.key)
  //     }
  //   });
  // console.log(lines);

  // var graphLines = prices.map((item)) => {
  //   if (item !== 'dateOfPrice') {
  //    return {
  //       x: item.dateOfPrice,
  //       y: prices.map(price => ,
  //       type: 'scatter'
  //     }
  //   };
  // });

  var dates = prices.map(item => item.dateOfPrice);
  var priceHigh = prices.map(item => item.high);
  var priceLow = prices.map(item => item.low);
  var closePrice = prices.map(item => item.close);
  var openPrice = prices.map(item => item.open);

  var high = {
    x: dates,
    y: priceHigh,
    name: 'High',
    mode: 'lines+markers'
  }

  var low = {
    x: dates,
    y: priceLow,
    name: 'Low',
    mode: 'lines+markers'
  }

  var close = {
    x: dates,
    y: closePrice,
    name: 'Close',
    mode: 'lines+markers'
  }

  var open = {
    x: dates,
    y: openPrice,
    name: 'Open',
    mode: 'lines+markers'
  }

  Plotly.newPlot('price-graph', [high, low, open, close]);
}

class StockPriceRow extends React.Component {
  render() {
    var cells = [];
    var priceElement = React.createElement("td", null, this.props.dateOfPrice);
    cells.push(priceElement);
    var dateElement = React.createElement("td", null, this.props.close);
    cells.push(dateElement);
    return React.createElement('tr', null, cells);
  }
}

$(app.load());