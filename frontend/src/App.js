import React, { useState, useEffect } from 'react';
import { Contract, Signer } from 'sui-move'; // Import SUI Move contract and signer
import './App.css';

function App() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [tokenMinted, setTokenMinted] = useState(false);
  const [canMint, setCanMint] = useState(false); // State to track if user can mint coins
  const [daoProposals, setDAOProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    async function initializeContract() {
      // Initialize contract and signer
      const contract = new Contract();
      const signer = new Signer();

      // Set contract and signer in state
      setContract(contract);
      setSigner(signer);

      // Check if user can mint coins
      const isEligible = await checkEligibility(); // Function to check eligibility
      setCanMint(isEligible);
    }

    initializeContract();
  }, []);

  // Function to check if user is eligible to mint coins
  const checkEligibility = async () => {
    // Logic to check if user has completed academic work or learning activity
    // For now, let's assume user needs to have a balance of at least 100 tokens to be eligible
    const balance = await contract.balanceOf(userAddress);
    return balance >= 100;
  };

  const handleUserAddressChange = (event) => {
    setUserAddress(event.target.value);
  };

  const handleUserBalanceCheck = async () => {
    if (contract && userAddress) {
      const balance = await contract.balanceOf(userAddress);
      setUserBalance(balance);
    }
  };

  const handleTokenMint = async () => {
    if (contract && signer && canMint) {
      // Call the mint function of the smart contract
      await contract.mint(userAddress, 100); // Mint 100 tokens for the user
      setTokenMinted(true);
    }
  };

  const handleFetchDAOProposals = async () => {
    if (contract) {
      // Fetch DAO proposals from the smart contract
      const proposals = await contract.getProposals();
      setDAOProposals(proposals);
    }
  };

  const handleSelectProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  return (
    <div className="App">
      <h1>Decentralized Learning DApp</h1>
      <div>
        <label htmlFor="userAddress">User Address:</label>
        <input type="text" id="userAddress" value={userAddress} onChange={handleUserAddressChange} />
        <button onClick={handleUserBalanceCheck}>Check Balance</button>
      </div>
      {userBalance > 0 && <p>Balance: {userBalance}</p>}
      <div>
        <button onClick={handleTokenMint} disabled={!canMint}>Mint Tokens</button>
        {tokenMinted && <p>Tokens successfully minted!</p>}
      </div>
      <div>
        <h2>DAO Governance</h2>
        <button onClick={handleFetchDAOProposals}>Fetch Proposals</button>
        <ul>
          {daoProposals.map((proposal, index) => (
            <li key={index} onClick={() => handleSelectProposal(proposal)}>
              {proposal.title}
            </li>
          ))}
        </ul>
        {selectedProposal && (
          <div>
            <h3>{selectedProposal.title}</h3>
            <p>{selectedProposal.description}</p>
            <button>Vote</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
