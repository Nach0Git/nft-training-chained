const { expect } = require('chai');
const { ethers } = require("hardhat");

describe('ChainEd Contract', () => {
    let ChainEd;
    let hardhatChainEd;
    let owner;
    let addr1;

    beforeEach(async () => {
        ChainEd = await ethers.getContractFactory('ChainEd');
        [owner,addr1] = await ethers.getSigners();

        hardhatChainEd = await ChainEd.deploy();
    });

    describe('Studends', () => {
        it('Should enroll one student && should emit one event', async () => {
            await expect(await hardhatChainEd.enrollStudent(owner.address,'Test Student',54))
            .to.emit(hardhatChainEd,'StudentAdded')
            .withArgs(owner.address,"Test Student")
            
            expect(await hardhatChainEd.studentExists(owner.address)).to.be.true;            
        });
        it('Should return an exception when check if one unexisted user exists', async () => {
            try {
                await hardhatChainEd.studentExists(addr1.address);
            } catch (err) {
                expect(err.message).to.contains('Student does not exit.');
            }
        });
    });
});
