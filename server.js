var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');
const request = require('request');
const fetch = require("node-fetch");

var port = process.env.PORT || 8000;
var cors = require('cors');
var app = express();

app.use(cors());

const kycJson = require('./contracts/KYCValidations.json');

app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const localnet = 'http://localhost:8545';
const infura = 'https://ropsten.infura.io/aSkZNGyMOzIcw1eOLEj9'
const web3 = new Web3( new Web3.providers.HttpProvider(infura) );
const {utils} = web3;
const contractAddress = "0x3603d6dd4034d91130722dbc4b0a0769a3ae8f4a";
let contract = new web3.eth.Contract(kycJson.abi, contractAddress);

const privateKey = '28b8154da399ae122867893502d290d988d63bbfa478149d8c688b412bc129e6';
const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const getPSD2Identity = async (url, token) => {
  let options = {
    method: 'POST',
    body: token
  };

  const res = await fetch(url, options);
  const json = await res.json();
  return json;
};

app.post('/kyc', async function(req, res) {
  if (req.method === 'OPTIONS') {
    console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    //headers["Access-Control-Allow-Origin"] = req.headers.origin;
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

    var  PSD2url = req.protocol + '://' + req.get('host') + '/psd2/my/transactions';
    var psd2Result = await getPSD2Identity(PSD2url, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.1cFjlFgBpDQI9ZEDSLLtceT6VXDVW79nBIY23Q6jRcM');

    console.log('identity');
    console.log(psd2Result);

    var result = psd2Result.firstName + psd2Result.lastName + psd2Result.email + psd2Result.identificationNumber;
    var hashFromBank = utils.sha3(result);

    console.log('hash1',hashFromBank);
    console.log('hash2',hashedData);
    if (hashFromBank === hashedData) {
      try {
        var result = await contract.methods.addOwnership(wallet, hashedData).send({from: web3.eth.defaultAccount, gas: 50000});

        console.log('contract result', result);
      } catch (error) {
        var data = {
          result: "Yes"
        };
        res.send(JSON.stringify(data));
      }
      var data = {
          result: "Yes"
        };
        res.send(JSON.stringify(data));
    } else {
      var data = {
          result: "No"
        };
        res.send(JSON.stringify(data));
    }
  }
});

app.get('/', function(req, res) {
  res.send('Hello from BlocKey!');
});

app.get('/success', function (req, res) {
  console.log('Success');
  res.send('Success');
});

// mocked psd2 endpoints
var psd2Result = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@gmail.com",
  identificationNumber: "84010902434"
}

app.post('/psd2/my/transactions', function(req, res) {
  // if (req.body.token === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.1cFjlFgBpDQI9ZEDSLLtceT6VXDVW79nBIY23Q6jRcM") {
    res.json(psd2Result);
  // } else {
  //   res.sendStatus(400);
  // }
});

app.post('/psd2/my/logins/direct', function(req, res) {
  var token_data = {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIiOiIifQ.1cFjlFgBpDQI9ZEDSLLtceT6VXDVW79nBIY23Q6jRcM"
  };
  res.send(JSON.stringify(token_data));
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
