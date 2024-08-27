import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "./WalletInteraction.css"
const CONTRACT_ADDRESS = "0x24562264bcd6ebd847df84f7e8056eeb85f7de74"; // Replace with your contract's address
const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "userid",
				"type": "uint256"
			}
		],
		"name": "AmountDeposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "userid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "BetAmountPlaced",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "Deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "placebet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			}
		],
		"name": "Spin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "userid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "iswinner",
				"type": "bool"
			}
		],
		"name": "SpinNumber",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "WithdrawAmount",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getUserDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "deposit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "betplaced",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "iswinner",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const WalletInteraction = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const connectToBlockchain = async () => {
            try {
                if (window.ethereum) {
                    const _provider = new ethers.providers.Web3Provider(window.ethereum);
                    const _signer = _provider.getSigner();
                    const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
                    
                    setProvider(_provider);
                    setSigner(_signer);
                    setContract(_contract);
                    
                    const address = await _signer.getAddress();
                    setUserAddress(address);
                    
                    // Fetch the user's current balance from the contract
                    const player = await _contract.players(address);
                    setUserBalance(ethers.utils.formatEther(player.deposit));
                } else {
                    console.error("Ethereum object not found. Install MetaMask.");
                }
            } catch (error) {
                console.error("Error connecting to blockchain:", error);
            }
        };

        connectToBlockchain();
    }, []);

    const handleDeposit = async () => {
        if (contract && depositAmount) {
            try {
                const tx = await contract.Deposit({ value: ethers.utils.parseEther(depositAmount) });
                await tx.wait();
                alert('Deposit successful!');
                const player = await contract.players(userAddress);
                setUserBalance(ethers.utils.formatEther(player.deposit));
            } catch (error) {
                console.error("Error making deposit:", error);
            }
        }
    };

    const handleWithdraw = async () => {
        if (contract && withdrawAmount) {
            try {
                const tx = await contract.Withdraw(ethers.utils.parseEther(withdrawAmount));
                await tx.wait();
                alert('Withdraw successful!');
                const player = await contract.players(userAddress);
                setUserBalance(ethers.utils.formatEther(player.deposit));
            } catch (error) {
                console.error("Error making withdrawal:", error);
            }
        }
    };

    return (
        <div className="wallet-container">
            <p className="balance">Balance:- {userBalance} ETH</p>
            
            <div className="transaction-section">
                <h2 className="section-title">Deposit</h2>
                <input 
                    className="amount-input"
                    type="text" 
                    placeholder="Amount to deposit (ETH)" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)} 
                />
                <button className="action-button" onClick={handleDeposit}>Deposit</button>
            </div>
            
            <div className="transaction-section">
                <h2 className="section-title">Withdraw</h2>
                <input 
                    className="amount-input"
                    type="text" 
                    placeholder="Amount to withdraw (ETH)" 
                    value={withdrawAmount} 
                    onChange={(e) => setWithdrawAmount(e.target.value)} 
                />
                <button className="action-button" onClick={handleWithdraw}>Withdraw</button>
            </div>
        </div>
    );
};

export default WalletInteraction;
