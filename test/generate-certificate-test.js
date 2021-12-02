const {expect} = require('chai');
const {ethers} = require("hardhat");

describe('ChainEd Contract - Generate NFT tests', () => {
    let ChainEd;
    let hardhatChainEd;
    let owner, adminTom, adminSally, studentPeter, studentJenny, studentMarian;

    beforeEach(async () => {
        ChainEd = await ethers.getContractFactory('ChainEd');
        [owner, adminTom, adminSally, studentPeter, studentJenny, studentMarian] = await ethers.getSigners();

        hardhatChainEd = await ChainEd.deploy();

        await hardhatChainEd.enrollAdmin(adminTom.address);
        await hardhatChainEd.enrollStudent(studentPeter.address, 'Peter', 54);
    });


    it('Contract SHOULD NOT generate a NFT for a student who hasn\'t passed all subjects.', async () => {
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 4, 'Algebra');
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 9, 'Compilers');
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Programming');
        try {
            await hardhatChainEd.connect(adminTom).generateNFTCertificate(studentPeter.address, "sample Uri");
        } catch (err) {
            expect(err.message).to.contains('Student needs to approve: Algebra');
        }
    });

    it('Contract SHOULD NOT generate a NFT for a non-existing student  .', async () => {
        try {
            await hardhatChainEd.connect(adminTom).generateNFTCertificate(studentJenny.address, "sample Uri");
        } catch (err) {
            expect(err.message).to.contains('Invalid student.');
        }
    });

    it('Contract SHOULD generate a NFT for a student who has passed all subjects.', async () => {
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Algebra');
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 9, 'Compilers');
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Programming');
        const NFTtx = hardhatChainEd.connect(adminTom).generateNFTCertificate(studentPeter.address, "sample Uri");

        await expect(await NFTtx).to
            .emit(hardhatChainEd, 'CertificateGenerated')
            .withArgs(adminTom.address, studentPeter.address, 1, "sample Uri");

        await expect(hardhatChainEd.balanceOf(studentPeter.address) === 1);
    });

    it('Contract SHOULD NOT generate multiple NFT for the same address.', async () => {
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Algebra');
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 9, 'Compilers');
        await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Programming');
        await hardhatChainEd.connect(adminTom).generateNFTCertificate(studentPeter.address, "sample Uri");

        try {
            await hardhatChainEd.connect(adminTom).generateNFTCertificate(studentPeter.address, "sample Uri");
        } catch (err) {
            expect(err.message).to.contains('Certificate already emitted.');
        }
    });
});
