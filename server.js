var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');

var port = process.env.PORT || 8000;
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// const testnet = "https://rinkeby.infura.io/" + process.env.INFURA_ACCESS_TOKEN;

const localnet = 'http://localhost:8545';
const web3 = new Web3( new Web3.providers.HttpProvider(localnet) );

app.post('/kyc', function(req, res) {
  if (req.method === 'OPTIONS') {
    console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
  } else {
    console.log("Received data");
    var token = req.body.token;
    var wallet = req.body.wallet;
    var hashedData = req.body.hashed_data;

    // TODO: call alior with the token to get user details
    var result = "hey";
    //TODO: 
    var hashFromBank = Web3.sha3(result);
    console.log(hashFromBank);
    var hashFromBank = "something";
    if (hashFromBank === hashedData) {
      //TODO: call method on Smart Contract
    }
    res.send(wallet + ' ' + token + ' ' + hashedData);
  }
});

app.get('/', function(req, res) {
  console.log(web3);
  res.send('Hello from BlocKey!');
});

app.get('/success', function (req, res) {
  console.log('Success');
  res.send('Success');
});


app.use(function(req, res, next) {
    var oneof = false;
    if (req.headers.origin) { //req.headers.origin.match(/whateverDomainYouWantToWhitelist/g) ) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
