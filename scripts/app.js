if(!window.app)
{
    window.app = {
        Load : _Load, 
        GetStockPrices : _GetStockPrices,
        RenderPrices : _RenderPrices,
        Prices: [ ]
    };
}

function _Load()
{
    var prices = app.GetStockPrices($("#stockTicker").val());
}

function _GetStockPrices(ticker)
{
    var urlTemplate = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={ticker}&apikey=ES0RLUA5ZTYI9VFC";
    var urlToFetch = urlTemplate.replace("{ticker}",ticker);
    console.log(urlToFetch);
    var fetchedPrices;
    $.getJSON({url: urlToFetch, success: function(result){
        fetchedPrices = result["Time Series (Daily)"];
        //normalize the price JSON we get back from the API.
        for(var p in result["Time Series (Daily)"])
        {
            app.Prices.push({"DateOfPrice": p, ClosePrice:fetchedPrices[p]["4. close"]});
        }
        app.RenderPrices(app.Prices);
    }});
}

function _RenderPrices(listOfPrices)
{
    var rows = [];
    for(var i = 0;i<listOfPrices.length; i++)
    {
            rows.push(React.createElement(StockPriceRow, listOfPrices[i]));
    }
    ReactDOM.render(
        rows,
        document.getElementById('priceList')
      );
}

class StockPriceRow extends React.Component {
    render() {
        var cells = [];
        var priceElement = React.createElement("td",null,this.props.DateOfPrice);
        cells.push(priceElement);
        var dateElement = React.createElement("td",null,this.props.ClosePrice);
        cells.push(dateElement);
      return React.createElement('tr', null, cells);
    }
}

$(app.Load());