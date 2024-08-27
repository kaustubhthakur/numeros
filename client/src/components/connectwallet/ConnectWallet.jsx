import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Check if there's an account stored in localStorage
    const savedAccount = localStorage.getItem('account');
    if (savedAccount) {
      setAccount(savedAccount);
      fetchBalance(savedAccount);
    }

    // Check if Ethereum is available
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0];
          setAccount(newAccount);
          localStorage.setItem('account', newAccount);
          fetchBalance(newAccount);
        } else {
          setAccount(null);
          setBalance(null);
          localStorage.removeItem('account');
        }
      });
    } else {
      console.log('Please install MetaMask!');
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const newAccount = accounts[0];
        setAccount(newAccount);
        localStorage.setItem('account', newAccount);
        fetchBalance(newAccount);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const fetchBalance = async (account) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceBigNumber = await provider.getBalance(account);
      const balanceInEther = ethers.utils.formatEther(balanceBigNumber);
      setBalance(balanceInEther);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    localStorage.removeItem('account');
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Account: {account}</p>
         
          <button onClick={disconnectWallet}> <p>Balance: {balance} ETH</p></button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
