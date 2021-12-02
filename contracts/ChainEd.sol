//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ChainEd is AccessControl, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Student {
        string name;
        uint nationalId;
        mapping(uint => Grade) grades;
        bool valid;
    }

    struct Subject {
        uint id;
        string name;
    }

    struct Grade {
        string subjectName;
        int grade;
    }

    /**
     * @dev the subjects that students have to pass in order to receive a certificate
     */
    Subject[] subjects;
    mapping(address => Student) studentsInfo;

    /**
     * @dev Admin role. Can add students, grade them and generate the certificates (NFTs).
     */
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /**
     * @dev Emitted when a new student is added.
     * the 'indexed' keyword means we can search for these events using the indexed parameters as a filter.
     */
    event StudentAdded(address indexed studentAddr, string studentName);

    /**
     * @dev Emitted when a grade is added to a student.
     */
    event GradeAdded(address indexed studentAddr, string indexed subject, int grade);

    /**
     * @dev Emitted when a new admin is added to the contract.
     */
    event AdminAdded(address indexed adminAddr);

    /**
     * @dev Emitted when a nft is generated.
     */
    event CertificateGenerated(address indexed grantedBy, address indexed grantedTo, uint256 indexed tokenId, string uri);

    constructor() ERC721("Certificates", "CED") {
        // Grant the contract deployer admin roles.
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        _initializeCareer();
    }

    function _initializeCareer() private {
        subjects.push(Subject({id : 1, name : "Algebra"}));
        subjects.push(Subject({id : 2, name : "Compilers"}));
        subjects.push(Subject({id : 3, name : "Programming"}));
    }

    function generateNFTCertificate(address _studentAddress, string memory _tokenURI) public onlyRole(ADMIN_ROLE) returns (uint256)
    {
        require(studentsInfo[_studentAddress].valid, "Invalid student.");
        require(balanceOf(_studentAddress) == 0, "Certificate already emitted.");

        for (uint i = 0; i < subjects.length; ++i) {
            Grade memory studentGrade = studentsInfo[_studentAddress].grades[subjects[i].id];
            require(studentGrade.grade > 6, string(abi.encodePacked("Student needs to approve: ", subjects[i].name)));
        }

        _tokenIds.increment(); // built-in method in Counters library to generate token IDS
        uint256 newItemId = _tokenIds.current();
        _mint(_studentAddress, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit CertificateGenerated(msg.sender, _studentAddress, newItemId, _tokenURI);
        return newItemId;
    }

    /**
     * @dev Functions to enroll/unenroll admins. We use 'grantRole' as opposed to '_setupRole' because 'grantRole' checks
     * if the msg.sender can grant the role (by checking if it's an admin of such role)
     */
    function enrollAdmin(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, _account);
        emit AdminAdded(_account);
    }

    function unenrollAdmin(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, _account);
    }

    /**
     * @dev Adds a student to the contract. Checks if the address already exist to avoid overriding data.
     * emits `StudentAdded` event
     */
    function enrollStudent(address _student, string memory _name, uint _nationalId) public onlyRole(ADMIN_ROLE) {
        require(!studentsInfo[_student].valid, "Student already exists.");

        Student storage newStudent = studentsInfo[_student]; // since Student structure has a nested mapping() property, it has to be initialized this way
        newStudent.name = _name;                             // see for reference: https://docs.soliditylang.org/en/v0.7.0/types.html?highlight=struct#structs
        newStudent.nationalId = _nationalId;
        newStudent.valid = true;

        emit StudentAdded(_student, _name);
    }

    /**
     * @dev This function is used to check if one student was already enrolled.
     */
    function studentExists(address _student) public view onlyRole(ADMIN_ROLE) returns(bool) {
        require(studentsInfo[_student].valid, "Student does not exit.");

        return studentsInfo[_student].valid;
    }

    /**
     * @dev Grade a students. Checks if the student exists, if its a valid grade and if the subject exist in the career.
     * emits `GradeAdded` event
     */
    function gradeStudent(address _student, int _grade, string memory _subjectName) public onlyRole(ADMIN_ROLE) {
        require(studentsInfo[_student].valid, "Address is not a student.");

        require(_grade > 0, "Invalid Grade.");
        require(_grade < 10, "Invalid Grade.");

        uint subjectId = getSubjectByName(_subjectName);

        require(subjectId != 0, "Invalid subject.");

        Grade memory studentGrade = Grade({grade : _grade, subjectName : _subjectName});
        studentsInfo[_student].grades[subjectId] = studentGrade;
        emit GradeAdded(_student, _subjectName, _grade);
    }

    /**
     * @dev Finds and returns the subject id for a subject name passed if exists.
     * returns 0 if we can't find it.
     */
    function getSubjectByName(string memory _subjectName) private view returns (uint) {
        for (uint i = 0; i < subjects.length; ++i) {
            if (keccak256(bytes(subjects[i].name)) == keccak256(bytes(_subjectName))) {
                return subjects[i].id;
            }
        }
        return 0;
    }

    // Both interfaces include an implementation for 'supportsInterface', therefore we need to override both.
    // See: https://forum.openzeppelin.com/t/derived-contract-must-override-function-supportsinterface/6315
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
