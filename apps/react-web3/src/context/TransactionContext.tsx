import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

interface TransactionContext {
  transactionCount: number;
  connectWallet: (...args: any[]) => any;
  transactions: any[];
  currentAccount: any;
  isLoading: boolean;
  sendTransaction: Function;
  handleChange: Function;
  formData: any;
}

export const TransactionContext = React.createContext<TransactionContext>({
  transactionCount: 0,
  connectWallet: () => {},
  transactions: [],
  currentAccount: '',
  isLoading: false,
  sendTransaction: () => {},
  handleChange: () => {},
  formData: {}
});

// metamask浏览器插件注入的对象
const { ethereum } = window;

const createEthereumContract = () => {
  // const provider = new ethers.providers.Web3Provider(ethereum);
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();
  console.log('block number', provider.blockNumber)
  return new ethers.Contract(contractAddress, contractABI, signer);
}

export const TransactionProvider: React.FC<{ children: any }> = ({ children }) => {
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" })
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(Number(localStorage.getItem("transactionCount")));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  /**
   * 检测是否安装 MetaMask
   */
  const checkEthereumExist = () => {
    if (!ethereum) {
      alert("请安装 MetaMask 钱包");
      return false;
    }
    return true
  }

  /**
   * 获取所有交易
   */
  const getAllTransactions = async () => {
    try {
      if (checkEthereumExist()) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction: any) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }))

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 检测是否连接钱包
   */
  const checkIfWalletIsConnect = async () => {
    try {
      if (checkEthereumExist()) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log('accounts:', accounts)
        if (accounts.length) {
          setCurrentAccount(accounts[0]);

          getAllTransactions();
        } else {
          console.log("No accounts found");
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 检测是否存在交易
   */
  const checkIfTransactionExists = async () => {
    try {
      if (checkEthereumExist()) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  /**
   * 连接钱包
   */
  const connectWallet = async () => {
    try {
      if (checkEthereumExist()) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        setCurrentAccount(accounts[0]);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  /**
   * 发送交易
   */
  const sendTransaction = async () => {
    try {
      if (checkEthereumExist()) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: '0x5208',
            value: parsedAmount._hex
          }]
        })

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }
  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
