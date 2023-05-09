const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarketplace", accounts => {
  it("Test that the smart contract can execute a successful NFT purchase", async () => {
    // Create a new instance of the smart contract
    const nftMarketplaceInstance = await NFTMarketplace.deployed();

    // Create two user accounts
    const seller = accounts[0];
    const buyer = accounts[1];

    // Create a new NFT with the first user account
    const tokenId = 1;
    const name = "Test NFT";
    const description = "This is a test NFT";
    await nftMarketplaceInstance.createNFT(tokenId, name, description, { from: seller });

    // List the NFT for sale using the listNFTForSale function with a sale price
    const salePrice = web3.utils.toWei("1", "ether");
    await nftMarketplaceInstance.listNFTForSale(tokenId, salePrice, { from: seller });

    // Purchase the NFT using the purchaseNFT function with the second user account and the correct amount of Ether
    const balanceSellerBefore = web3.utils.toBN(await web3.eth.getBalance(seller));
    await nftMarketplaceInstance.purchaseNFT(tokenId, { from: buyer, value: salePrice });
    const balanceSellerAfter = web3.utils.toBN(await web3.eth.getBalance(seller));

    // Assert that the NFT is now owned by the second user account and the correct amount of Ether was transferred to the first user account
    const newOwner = await nftMarketplaceInstance.ownerOf(tokenId);
    assert.equal(newOwner, buyer);
    assert.equal(balanceSellerAfter.sub(balanceSellerBefore), salePrice);
  });
});