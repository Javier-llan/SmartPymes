pragma solidity ^0.4.24;

contract Employee {

  address public owner;

  struct Worked {
      uint loyaltyPoints;
      uint totalEmployeds;
  }

  struct Employed {
      string name;
      uint256 salary;
  }

  uint etherPerPoint = 0.5 ether;

  Employed[] public employeds;

  mapping(address => Worked) public workeds;
  mapping(address => Employed[]) public workedsEmployeds;
  mapping(address => uint) public workedsTotalEmployeds;
  
  event EmployedPurchased(address indexed worked, uint salary, string employed);

  constructor(){
      owner = msg.sender;   
      employeds.push(Employed('Javier', 4 ether));
      employeds.push(Employed('Milton', 3 ether));
      employeds.push(Employed('Jose', 3 ether));
  }   

  function buyEmployed(uint employedIndex) public payable {
      Employed employed = employeds[employedIndex];
      require(msg.value == employed.salary);

      Worked storage worked = workeds[msg.sender];
      worked.loyaltyPoints += 5;
      worked.totalEmployeds += 1;
      workedsEmployeds[msg.sender].push(employed);
      workedsTotalEmployeds[msg.sender] ++;

      EmployedPurchased(msg.sender, employed.salary, employed.name);
  }

  function totalEmployeds() public view returns (uint) {
      return employeds.length;
  }

  function redeemLoyaltyPoints() public {
      Worked storage worked = workeds[msg.sender];
      uint etherToRefund = etherPerPoint * worked.loyaltyPoints;
      msg.sender.transfer(etherToRefund);
      worked.loyaltyPoints = 0;
  }

  function getRefundableEther() public view returns (uint) {
      return etherPerPoint * workeds[msg.sender].loyaltyPoints;
  }

  function getEmployeeBalance() public isOwner view returns (uint) {
      address employeAddress = this;
      return employeAddress.balance;
  }

  modifier isOwner() {
      require(msg.sender == owner);
      _;
  }
}