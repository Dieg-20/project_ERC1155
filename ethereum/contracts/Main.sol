pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract PoolFactory {
    Pool[] public deployedPools;

    function createPool(uint stockCount, string memory poolName) public {
        Pool newPool  = new Pool(stockCount, poolName, payable(msg.sender));
        deployedPools.push(newPool);
    }
    
        function getDeployedPools() public view returns (Pool[] memory) {
        return deployedPools;
    }
    
}

contract Pool is ERC1155  {
    
    string poolName;
    uint tokenCount;
    address payable poolManager;
    
    uint public constant stockIdx = 0;
    
    constructor(uint stockCount, string memory providedPoolName, address payable creator) public ERC1155("") {
        poolManager = creator;
        poolName = providedPoolName;
        tokenCount = stockCount;
        _mint(creator, stockIdx, stockCount, "");
    }
    
    
    function transferToken(uint tokenTransferAmmount) public payable {
        _safeTransferFrom(poolManager, msg.sender, stockIdx, tokenTransferAmmount, "0x0");
    }
    
        function getAccountTokenBalance( address providedAccount,  uint id) public returns(uint) {
        return balanceOf(providedAccount, id);
    }
    
    function cashOut() public payable {
        require(msg.sender == poolManager);
        poolManager.transfer(address(this).balance);
    }
    
    function getSummary() public view returns(string memory, uint) {
        return (
            poolName,
            tokenCount
            );
    }
     
}