require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

task("gradeStudent", "Adds a grade to the student")
    .addPositionalParam("receiver", "The Student address")
    .addPositionalParam("grade", "Grade")
    .addPositionalParam("subject", "The subject -- Must be Algebra, Compilers or Programming")
    .setAction(async ({receiver, grade, subject}) => {

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
        const tx = await chainEdContract.gradeStudent(receiver, grade, subject);
        const receipt = await tx.wait();

        // status 0 means error, and that's all I know.
        if (receipt.status === 1) {
            const tx2 = await chainEdContract.balanceOf(receiver);
            console.log("Grade Added Successfully.");
        }
    });
