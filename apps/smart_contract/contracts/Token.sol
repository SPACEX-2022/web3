pragma solidity ^0.8.0;

// 代币
contract Token {
    string public name = "My Hardhat Token";// 代币描述
    string public symbol = "MBT";// 代币唯一标识

    // 发行总量
    uint256 public totalSupply = 1000000;

    // 拥有者
    address public owner;

    // 余额
    mapping(address => uint256) balances;

    /**
     * 合约构造函数
     *
     * `constructor` 只在合约创建时执行一次。 `public` 修饰符使函数可以从合约外部调用。
     */
    constructor() public {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        // 检查交易发送方是否有足够的令牌。如果 `require` 的第一个参数评估为 `false`，则交易将恢复。
        require(balances[msg.sender] > amount, "not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    /**
     * 读取某账号的代币余额
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     * `view` 修饰符表示它不会修改合约的状态，这允许我们在不执行事务的情况下调用它。
     */
    function balanceOf(address account) external view returns(uint256) {
        return balances[account];
    }
}
