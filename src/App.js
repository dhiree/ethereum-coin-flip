import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import './App.css';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState(null);
  const [result, setResult] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletConnected(true);
      const balance = await provider.getBalance(address);
      setBalance(formatEther(balance));
    } else {
      alert('Install MetaMask!');
    }
  };

  const flipCoin = () => {
    if (!walletConnected || !betAmount || !selectedSide) {
      alert('Connect wallet, enter bet amount, and select a side.');
      return;
    }

    const flipResult = Math.floor(Math.random() * 2);
    const isWin = flipResult === (selectedSide === 'heads' ? 0 : 1);
    setResult(isWin ? 'You won!' : 'You lost!');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Coin Flip Game</h1>
      <div className="text-center">
        <button className="btn btn-success mb-4" onClick={connectWallet}>
          Connect Wallet
        </button>

        {walletConnected && (
          <>
            <div className="alert alert-info mb-4">
              <p>
                Balance: <strong>{balance} <i className="fab fa-ethereum"><i>eth</i></i></strong>
              </p>
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <button
                className={`btn ${selectedSide === 'heads' ? 'btn-success' : 'btn-outline-success'} mr-2`}
                onClick={() => setSelectedSide('heads')}
              >
                Heads
              </button>
              <button
                className={`btn ${selectedSide === 'tails' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setSelectedSide('tails')}
              >
                Tails
              </button>
            </div>
            <button className="btn btn-warning" onClick={flipCoin}>
              Flip Coin
            </button>
            {result && <p className={`mt-3 ${result === 'You won!' ? 'text-success' : 'text-danger'}`}>{result}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
