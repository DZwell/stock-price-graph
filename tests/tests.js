const sinon = require('sinon');
const getStockPrices = require('../scripts/app').getStockPrices;

describe('getStockPrices', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  
  afterEach((() => {
    sandbox.restore();
  }))
  
  it('should do stuff', () => {
    sandbox.stub(document, 'getElementById').withArgs('go-button');
    console.log(getStockPrices);
  });
});
