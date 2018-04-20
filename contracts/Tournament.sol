pragma solidity ^0.4.19;

import "./XCCToken.sol";
// import "zeppelin-solidity/contracts/Ownership/OnlyOwner.sol";
contract Tournament {
    address public creator;

    event BeginVote(); // an event to inform clients about the begging of voting.
                       // can be triggered as browser Notifications
    event Estimated(uint balance); // an event informing about end of votes
    event ResultsCalculated(); // inform clients that results are calculated

    event Claimed(string name, uint balance);

    XCCToken public token;
    mapping (address => string) public nameOf;
    mapping (address => uint) private userToEntry;
    mapping (address => uint) private rewarded;
    address[] players;
    uint[] public stake;
    uint[] public confidence;
    uint[] public estimatedValue;


    bool private isEstimating;
    uint private realValue;

    uint private answerIndex;

    struct Item {
        uint itemId;
        string name;
        uint realValue;
    }

    Item[] public items;

    function Tournament(address XCCAddress) public {
        creator = msg.sender;
        token = XCCToken(XCCAddress);
        items.push(Item(5, "test1", 55));
        isEstimating = true;
        answerIndex = 0;
        realValue = 42;
    }


    function addAnswer(uint value_, uint stake_, uint confidence_) public {
        require(stake_ > 0);
        require(stake_ <= token.balanceOf(msg.sender));
        require(confidence_ > 0);
        require(isEstimating);

        stake.push(stake_);
        confidence.push(confidence_);
        estimatedValue.push(value_);

        userToEntry[msg.sender] = answerIndex;
        players.push(msg.sender);
        answerIndex++;
        token.stake(msg.sender, stake_);

        address addr = msg.sender;
        uint balance = token.balanceOf(addr);

        Estimated(balance);
    }

    function calculateResults() public {
        // use https://github.com/numerai/contract ???
        require(isEstimating == false);
        // uint[] confidenceIndices;
        for(uint i = 0; i< answerIndex; i++) {
            uint estimation = estimatedValue[i];
            address player = players[i];

            if(isEstimationValid(estimation,realValue)) {
                uint conf = confidence[i];
                // if(conf > confidenceIndices[0]){
                    //order by confidence
                // }
                uint amount = stake[i]/conf;
                token.payBack(player,stake[i]);
                rewarded[player] = token.rewardStake(player,amount);//first come first served basis

            }
        }

        ResultsCalculated();
    }

    function claim(string name) public {
        address addr = msg.sender;
        uint balance = token.grantedTo(addr);
        nameOf[addr] = name;
        Claimed(name, balance);
    }

    function getName(address a) public view returns (string) {
        return nameOf[a];
    }

    function finishEstimationPhase() public {
        isEstimating = false;
        calculateResults();
    }


    function APE1000(uint estimatedValue_, uint realValue_) pure public returns (uint){
        uint biggerValue = estimatedValue_ > realValue_ ? estimatedValue_ : realValue_;
        uint smallerValue = estimatedValue_ <= realValue_ ? estimatedValue_ : realValue_;
        uint result = (1000 * (biggerValue - smallerValue)) / realValue_;
        return result;
    }

    function restart() public {
        isEstimating = true;
        // calculateResults();
    }

    function isEstimationValid(uint estimatedValue_, uint realValue_) pure public returns (bool){
        bool result = APE1000(estimatedValue_,realValue_) < 200;
        return result;
    }

    function myResult() view public returns (string, uint, uint, uint, bool, uint) {
        return resultForPlayer(msg.sender);
    }

    function resultForPlayer(address player) view public returns (string, uint, uint, uint, bool, uint)  {
        string name = nameOf[player];
        uint entry = userToEntry[player];
        uint estimation = estimatedValue[entry];
        uint staked = stake[entry];

        bool valid = isEstimationValid(estimation,realValue);
        uint rewardValue = rewarded[player];

        return (name,estimation,realValue,staked,valid,rewardValue);
    }
}
