// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface. --
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    console.log( "Deploying to:", network.name);

    if (network.name === "hardhat") {
        console.warn(
            "You are running the task with Hardhat network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // We get the contract to deploy
    const chainEd = await hre.ethers.getContractFactory("ChainEd");
    const contract = await chainEd.deploy();

    await contract.deployed();

    console.log("Contract deployed to:", contract.address);

    saveContractAddress(contract.address);
}

function saveContractAddress(address) {
    const fs = require("fs");
    const utilsFolder = __dirname + "/../utils";

    if (!fs.existsSync(utilsFolder)) {
        fs.mkdirSync(utilsFolder);
    }

    fs.writeFileSync(
        utilsFolder + "/contract-address.json",
        JSON.stringify({ chained: address }, undefined, 2)
    );

    const chainEdArtifact = artifacts.readArtifactSync("ChainEd");
    fs.writeFileSync(
        utilsFolder + "/ChainEd.json",
        JSON.stringify(chainEdArtifact, null, 2)
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
