// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Suerte {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    uint256[6] private arr = [0, 1, 0, 2, 0, 3];
    uint256 public userids;
    struct Player {
        uint256 deposit;
        uint256 betplaced;
        uint256 id;
        bool iswinner;
    }
    mapping(address => Player) public players;
    event AmountDeposit(address user, uint256 amount, uint256 userid);
    event WithdrawAmount(address user, uint256 _amount);
    event BetAmountPlaced(address user, uint256 userid, uint256 _amount);
    event SpinNumber(address user, uint256 userid, bool iswinner);

    function Deposit() public payable {
        require(msg.value > 0.0001 ether, "invalid amount");
        userids++;
        players[msg.sender].deposit += msg.value;
        emit AmountDeposit(msg.sender, msg.value, userids);
    }

    function Withdraw(uint256 _amount) public {
        require(_amount <= players[msg.sender].deposit, "invalid amount");
        players[msg.sender].deposit -= _amount;
        payable(msg.sender).transfer(_amount);
        emit WithdrawAmount(msg.sender, _amount);
    }

    function placebet(uint256 _amount) public {
        require(_amount > 0, "invalid amount");
        players[msg.sender].deposit -= _amount;
        players[msg.sender].betplaced = _amount;

        players[msg.sender].id = userids;
        emit BetAmountPlaced(msg.sender, players[msg.sender].id, _amount);
    }

    function generateRandomNumber() private view returns (uint256) {
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    block.number
                )
            )
        );
        return (random % 10) + 1;
    }

    function getRandomElement() private view returns (uint256) {
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.prevrandao, block.timestamp))
        ) % 6;
        return arr[randomIndex];
    }

    function Spin(uint256 _number) public {
        require(players[msg.sender].betplaced > 0, "invalid number");
        uint256 numbergenerated = generateRandomNumber();
        bool flag = false;
        uint256 idxnumber = getRandomElement();
        if (_number == numbergenerated) {
            players[msg.sender].deposit += (players[msg.sender].betplaced +
                (players[msg.sender].betplaced * idxnumber));
            flag = true;
            players[msg.sender].betplaced = 0;
            players[msg.sender].iswinner = true;
        } else {
            players[msg.sender].betplaced = 0;
            flag = false;
            players[msg.sender].iswinner = false;
        }
        emit SpinNumber(msg.sender, players[msg.sender].id, flag);
    }

    function getUserDetails()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        return (
            players[msg.sender].deposit,
            players[msg.sender].betplaced,
            players[msg.sender].id,
            players[msg.sender].iswinner
        );
    }
}
