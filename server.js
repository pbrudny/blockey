var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');

var port = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// const testnet = "https://rinkeby.infura.io/" + process.env.INFURA_ACCESS_TOKEN;
// const web3 = new Web3( new Web3.providers.HttpProvider(testnet) );

app.post('/kyc', function(req, res) {
  console.log("Received data");
  var token = req.body.token;
  var wallet = req.body.wallet;
  var hashedData = req.body.hashed_data;

  // TODO: call alior with the token to get user details
  var result = "hey";
  //TODO: var hashFromBank = Web3.sha3(result);
  var hashFromBank = "something";
  if (hashFromBank === hashedData) {
    //TODO: call method on Smart Contract
  }
  res.send(wallet + ' ' + token + ' ' + hashedData);
});

app.get('/', function(req, res) {
  // console.log(web3);
  res.send('Hello from BlocKey!');
});

app.get('/success', function (req, res) {
  console.log('Success');
  res.send('Success');
})

app.use(function(req, res, next) {
  res.status(404).send
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
