// Step 1: Get a contract into my application
var web3 = require("Web3");
var json = require("../build/contracts/NFTMarketplace.json");

// Step 2: Turn that contract into an abstraction I can use
var contract = require("truffle-contract");
var NFTMarketplace = contract(json);

// Step 3: Provision the contract with a web3 provider
NFTMarketplace.setProvider(new web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Step 4: Use the contract!
let owner = "0xC74aC8940D959eAcf20838A2deE44Bc19682e781";
NFTMarketplace.deployed().then(function(instance) {
  const tokenId = 0;
  instance.createNFT(
    tokenId,
    "name",
    "desc",
    { from: owner }
  )
  .then(
    function (data) {
      if (data) {
        console.log("========data:");
        console.log(data);
      }
      instance.tokenURI(tokenId).then(function(uri) {
        console.log("uri: " + uri);
      });
    },
    function (error) {
      if (error) {
        console.log("========error:");
        console.log(error);
      }
    }
  );
});