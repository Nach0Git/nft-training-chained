require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("generate", "Generate a nft for the address provided")
    .addPositionalParam("receiver", "The the address that will receive the NFT")
    .setAction(async ({receiver}) => {

        const addressesFile =
            __dirname + "/../utils/contract-address.json";

        if (!fs.existsSync(addressesFile)) {
            console.error("You need to deploy your contract first");
            return;
        }

        const addressJson = fs.readFileSync(addressesFile);
        const address = JSON.parse(addressJson);

        if ((await ethers.provider.getCode(address.chained)) === "0x") {
            console.error("You need to deploy your contract first");
            return;
        }

        const chainEdContract = await ethers.getContractAt("ChainEd", address.chained);
        const tx = await chainEdContract.generateNFTCertificate(receiver, "This is my pretty NFT");
        const receipt = await tx.wait();

        // status 0 means error, and that's all I know.
        if (receipt.status === 1) {
            const tx2 = await chainEdContract.balanceOf(receiver);
            console.log("Address %s has now %s NFTs", receiver, tx2)
        }
    });
