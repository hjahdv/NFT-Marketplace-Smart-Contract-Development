const NFTMarketplace =  artifacts.require("./contracts/NFTMarketplace.sol");
module.exports = function(deployer) {
  deployer.deploy(NFTMarketplace);
};