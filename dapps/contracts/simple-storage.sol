pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;
    string public message;

    address public owner;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event ValueUpdated(uint256 newValue);
    event MessageUpdated(string newMessage);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }

    function setMessage(string calldata _message) public onlyOwner {
        message = _message;
        emit MessageUpdated(_message);
    }
}
