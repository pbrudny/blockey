var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');

var port = process.env.PORT || 8000;
var app = express();

const kycJson = require('./contracts/KYCValidations.json');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// const testnet = "https://rinkeby.infura.io/" + process.env.INFURA_ACCESS_TOKEN;

const localnet = 'http://localhost:8545';
const infura = 'https://ropsten.infura.io/aSkZNGyMOzIcw1eOLEj9'
const web3 = new Web3( new Web3.providers.HttpProvider(infura) );
const {utils} = web3;
const contractAddress = "0xcdf29525b1b81ea064f123c5524737eabb5547ed";
let contract = new web3.eth.Contract(kycJson.abi, contractAddress);

const privateKey = '28b8154da399ae122867893502d290d988d63bbfa478149d8c688b412bc129e6';
const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

app.post('/kyc', async function(req, res) {
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
    var hashFromBank = utils.sha3(result);

    const callResult = await contract.methods.checkOwnership("0xcdf29525b1b81ea064f123c5524737eabb5547ed", "0x02e82a26540a3a4f0fbffc10dc2aa00b64f58824ca2e6cac79c7b4bac1e41d5c").call({from: web3.eth.defaultAccount, gas: 34856})

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
