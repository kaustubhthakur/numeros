import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "./BettingGame.css"
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

const BettingGame = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [betNumber, setBetNumber] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [betPlaced, setBetPlaced] = useState(false);
    const [result, setResult] = useState(null);
    const [userDetails, setUserDetails] = useState({
        deposit: null,
        betplaced: null,
        id: null,
        iswinner: null,
    });

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
                    
                    const player = await _contract.players(address);
                    setUserBalance(ethers.utils.formatEther(player.deposit));
                    setBetPlaced(player.betplaced > 0);

                    // Fetch user details
                    const details = await _contract.getUserDetails();
                    setUserDetails({
                        deposit: ethers.utils.formatEther(details[0]),
                        betplaced: ethers.utils.formatEther(details[1]),
                        id: details[2].toString(),
                        iswinner: details[3],
                    });

                } else {
                    console.error("Ethereum object not found. Install MetaMask.");
                }
            } catch (error) {
                console.error("Error connecting to blockchain:", error);
            }
        };

        connectToBlockchain();
    }, []);

    const handlePlaceBet = async () => {
        if (contract && betAmount) {
            try {
                const tx = await contract.placebet(ethers.utils.parseEther(betAmount));
                await tx.wait();
                alert('Bet placed successfully!');
                setBetPlaced(true);
                const player = await contract.players(userAddress);
                setUserBalance(ethers.utils.formatEther(player.deposit));

                // Fetch updated user details
                const details = await contract.getUserDetails();
                setUserDetails({
                    deposit: ethers.utils.formatEther(details[0]),
                    betplaced: ethers.utils.formatEther(details[1]),
                    id: details[2].toString(),
                    iswinner: details[3],
                });

            } catch (error) {
                console.error("Error placing bet:", error);
            }
        }
    };

    const handleSpin = async () => {
        if (contract && betNumber) {
            try {
                const tx = await contract.Spin(betNumber);
                await tx.wait();
                alert('Spin completed!');
                const player = await contract.players(userAddress);
                setUserBalance(ethers.utils.formatEther(player.deposit));
                setResult(player.iswinner ? "You won!" : "You lost!");
                setBetPlaced(false);

                // Fetch updated user details
                const details = await contract.getUserDetails();
                setUserDetails({
                    deposit: ethers.utils.formatEther(details[0]),
                    betplaced: ethers.utils.formatEther(details[1]),
                    id: details[2].toString(),
                    iswinner: details[3],
                });

            } catch (error) {
                console.error("Error spinning:", error);
            }
        }
    };

    return (
        <div className="betting-game-container">
        {!betPlaced ? (
            <div className="place-bet-section">
                <h2 className="section-title">Place a Bet</h2>
                <input 
                    className="bet-input" 
                    type="text" 
                    placeholder="Bet Amount (ETH)" 
                    value={betAmount} 
                    onChange={(e) => setBetAmount(e.target.value)} 
                />
                <button className="bet-button" onClick={handlePlaceBet}>Place Bet</button>
            </div>
        ) : (
            <div className="spin-wheel-section">
                <h2 className="section-title">Spin the Wheel</h2>
                <input 
                    className="bet-input" 
                    type="text" 
                    placeholder="Choose a number (1-10)" 
                    value={betNumber} 
                    onChange={(e) => setBetNumber(e.target.value)} 
                />
                <button className="spin-button" onClick={handleSpin}>Spin</button>
            </div>
        )}

        {result && <p className="result-message">{result}</p>}

        <h2 className="user-details-title">User Details</h2>
        <div className="user-details">
            <p>Deposit: {userDetails.deposit} ETH</p>
            <p>Bet Placed: {userDetails.betplaced} ETH</p>
            <p>User ID: {userDetails.id}</p>
            <p>Winner: {userDetails.iswinner ? 'Yes' : 'No'}</p>
        </div>
    </div>
    );
};

export default BettingGame;
