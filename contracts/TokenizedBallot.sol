// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getTokenBalanceAtBlock(address account, uint256 targetBlockNumber) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;  
        uint voteCount;  
    }

    IMyToken public tokenContract; 
    Proposal[] public proposals; 
    uint256 public targetBlockNumber;  
    mapping(address => uint256) public votePowerSpent;  

    event VoteCast(address indexed voter, uint256 proposalIndex, uint256 amount);

    constructor(
        bytes32[] memory _proposalNames,  
        address _tokenContract,  
        uint256 _targetBlockNumber  // Snaptshot block number
    ) {
        require(_targetBlockNumber <= block.number, "Target block number must be in the past");
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;

        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    // Function to cast votes
    function vote(uint256 proposal, uint256 amount) external {
        require(proposal < proposals.length, "Proposal does not exist");
        uint256 availableVotes = tokenContract.getTokenBalanceAtBlock(msg.sender, targetBlockNumber) - votePowerSpent[msg.sender];
        require(availableVotes >= amount, "Not enough votes");

        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;

        emit VoteCast(msg.sender, proposal, amount);
    }

    // Function to determine the winning proposal
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Function to get the name of the winning proposal
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
