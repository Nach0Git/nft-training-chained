require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

task("addStudent", "Adds a Student")
    .addPositionalParam("receiver", "The Student address")
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
        const tx = await chainEdContract.enrollStudent(receiver, "Ignacio Morales", 1);
        const receipt = await tx.wait();

        // status 0 means error, and that's all I know.
        if (receipt.status === 1) {
            console.log("Student Added Successfully.");
        }
    });
