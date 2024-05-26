import React, { useState, useEffect } from 'react';
import { Contract, Signer } from 'sui-move'; // Import SUI Move contract and signer
import './App.css';

function App() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    async function initializeContract() {
      // Initialize contract and signer
      const contract = new Contract();
      const signer = new Signer();

      // Set contract and signer in state
      setContract(contract);
      setSigner(signer);
    }

    initializeContract();
  }, []);

  const handleUserAddressChange = (event) => {
    setUserAddress(event.target.value);
  };

  const handleUserBalanceCheck = async () => {
    if (contract && userAddress) {
      const balance = await contract.balance(userAddress);
      setUserBalance(balance);
    }
  };

  return (
    <div className="App">
      <h1>SUI Move Smart Contract Interaction</h1>
      <div>
        <label htmlFor="userAddress">User Address:</label>
        <input type="text" id="userAddress" value={userAddress} onChange={handleUserAddressChange} />
        <button onClick={handleUserBalanceCheck}>Check Balance</button>
      </div>
      {userBalance > 0 && <p>Balance: {userBalance}</p>}
    </div>
  );
}

export default App;
