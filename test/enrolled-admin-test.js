const {expect} = require('chai');
const {ethers} = require("hardhat");

describe('ChainEd Contract - Admin Test - Enrolled admin actions', () => {
    let ChainEd;
    let hardhatChainEd;
    let owner, adminTom, adminSally, studentPeter, studentJenny, studentMarian;

    beforeEach(async () => {
        ChainEd = await ethers.getContractFactory('ChainEd');
        [owner, adminTom, adminSally, studentPeter, studentJenny, studentMarian] = await ethers.getSigners();

        hardhatChainEd = await ChainEd.deploy();

        await hardhatChainEd.enrollAdmin(adminTom.address);
    });


    it('Admin SHOULD enroll a student.', async () => {
        // 'connect()' method allows us to execute chainEd methods with an address different than the 'owner'.
        const enrollStudentTx = hardhatChainEd.connect(adminTom).enrollStudent(studentPeter.address, 'Peter', 54);
        await expect(await enrollStudentTx).to
            .emit(hardhatChainEd, 'StudentAdded')
            .withArgs(studentPeter.address, 'Peter')

        await expect(await hardhatChainEd.studentExists(studentPeter.address)).to.be.true;
    });

    it('Admin SHOULD add a grade for Algebra to an existing student.', async () => {
        await hardhatChainEd.connect(adminTom).enrollStudent(studentPeter.address, 'Peter', 54);

        const gradeStudentTx = hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Algebra')
        await expect(await gradeStudentTx).to
            .emit(hardhatChainEd, 'GradeAdded')
            .withArgs(studentPeter.address, 'Algebra', 8);
    });

    it('Admin SHOULD NOT add a grade for a non-existing subject.', async () => {
        await hardhatChainEd.connect(adminTom).enrollStudent(studentPeter.address, 'Peter', 54);

        try {
            await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Random Subject')
        } catch (err) {
            expect(err.message).to.contains('Invalid subject.');
        }
    });

    it('Admin SHOULD NOT add a grade for a non-existing student.', async () => {
        try {
            // notice we haven't added the student prior to grade him
            await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 8, 'Algebra')
        } catch (err) {
            expect(err.message).to.contains('Address is not a student.');
        }
    });

    it('Admin SHOULD NOT add a grade if the grade value is > 10 or < 0', async () => {
        await hardhatChainEd.connect(adminTom).enrollStudent(studentPeter.address, 'Peter', 54);

        try {
            await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, 11, 'Algebra')
        } catch (err) {
            expect(err.message).to.contains('Invalid Grade.');
        }

        try {
            await hardhatChainEd.connect(adminTom).gradeStudent(studentPeter.address, -5, 'Algebra')
        } catch (err) {
            expect(err.message).to.contains('Invalid Grade.');
        }
    });

    it('Admin SHOULD NOT enroll another admin', async () => {
        try {
            await hardhatChainEd.connect(adminTom).enrollAdmin(adminSally.address);
        } catch (err) {
            expect(err.message).to.contains('AccessControl: account ');
            expect(err.message).to.contains(' is missing role');
        }
    });

    it('Admin SHOULD NOT unenroll another admin', async () => {
        // without the 'connect()' the enroll works because it uses the 'owner' address
        await hardhatChainEd.enrollAdmin(adminSally.address);

        try {
            await hardhatChainEd.connect(adminTom).unenrollAdmin(adminSally.address);
        } catch (err) {
            expect(err.message).to.contains('AccessControl: account ');
            expect(err.message).to.contains(' is missing role');
        }
    });
});
