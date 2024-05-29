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
  const [stakedTokens, setStakedTokens] = useState(0);
  const [userName, setUserName] = useState('');
  const [activity, setActivity] = useState({
    completedModules: 0,
    discussions: 0,
    contentCreated: 0,
    contentUpdated: 0,
    contentDeleted: 0,
  });

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

      // Fetch user info
      if (userAddress) {
        const balance = await contract.balanceOf(userAddress);
        setUserBalance(balance);
        const info = await contract.getUserInfo(userAddress);
        setUserName(info.name);
        const stakedDetails = await contract.getStakerDetails(userAddress);
        setStakedTokens(stakedDetails[0]);
        const activityDetails = await contract.getActivity(userAddress);
        setActivity({
          completedModules: activityDetails[0],
          discussions: activityDetails[1],
          contentCreated: activityDetails[2],
          contentUpdated: activityDetails[3],
          contentDeleted: activityDetails[4],
        });
      }
    }

    initializeContract();
  }, [userAddress]);

  // Function to check if user is eligible to mint coins
  const checkEligibility = async () => {
    if (contract && userAddress) {
      const balance = await contract.balanceOf(userAddress);
      return balance >= 100;
    }
    return false;
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

  const handleStakeTokens = async (amount) => {
    if (contract && signer) {
      await contract.stakeTokens(userAddress, amount);
      const stakedDetails = await contract.getStakerDetails(userAddress);
      setStakedTokens(stakedDetails[0]);
    }
  };

  const handleUnstakeTokens = async (amount) => {
    if (contract && signer) {
      await contract.unstakeTokens(userAddress, amount);
      const stakedDetails = await contract.getStakerDetails(userAddress);
      setStakedTokens(stakedDetails[0]);
    }
  };

  const handleClaimRewards = async () => {
    if (contract && signer) {
      await contract.claimReward(userAddress);
      // Update user balance after claiming rewards
      const balance = await contract.balanceOf(userAddress);
      setUserBalance(balance);
    }
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
      <div>
        <h2>Staking</h2>
        <p>Staked Tokens: {stakedTokens}</p>
        <button onClick={() => handleStakeTokens(50)}>Stake 50 Tokens</button>
        <button onClick={() => handleUnstakeTokens(50)}>Unstake 50 Tokens</button>
        <button onClick={handleClaimRewards}>Claim Rewards</button>
      </div>
      <div>
        <h2>User Info</h2>
        <p>Name: {userName}</p>
        <p>Completed Modules: {activity.completedModules}</p>
        <p>Discussions: {activity.discussions}</p>
        <p>Content Created: {activity.contentCreated}</p>
        <p>Content Updated: {activity.contentUpdated}</p>
        <p>Content Deleted: {activity.contentDeleted}</p>
      </div>
    </div>
  );
}

export default App;
