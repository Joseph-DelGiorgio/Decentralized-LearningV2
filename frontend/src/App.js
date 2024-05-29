import React, { useState, useEffect } from 'react';
import { Contract, Signer } from 'sui-move';
import './App.css';
import UserAddressInput from './components/UserAddressInput';
import UserBalance from './components/UserBalance';
import TokenMinting from './components/TokenMinting';
import DAOProposals from './components/DAOProposals';
import Staking from './components/Staking';
import UserInfo from './components/UserInfo';

function App() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [tokenMinted, setTokenMinted] = useState(false);
  const [canMint, setCanMint] = useState(false);
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
      const contract = new Contract();
      const signer = new Signer();
      setContract(contract);
      setSigner(signer);
      const isEligible = await checkEligibility();
      setCanMint(isEligible);

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
      await contract.mint(userAddress, 100);
      setTokenMinted(true);
    }
  };

  const handleFetchDAOProposals = async () => {
    if (contract) {
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
      const balance = await contract.balanceOf(userAddress);
      setUserBalance(balance);
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Learning DApp</h1>
      <UserAddressInput
        userAddress={userAddress}
        onAddressChange={handleUserAddressChange}
        onBalanceCheck={handleUserBalanceCheck}
      />
      <UserBalance balance={userBalance} />
      <TokenMinting
        canMint={canMint}
        onMint={handleTokenMint}
        tokenMinted={tokenMinted}
      />
      <DAOProposals
        proposals={daoProposals}
        onFetchProposals={handleFetchDAOProposals}
        onSelectProposal={handleSelectProposal}
        selectedProposal={selectedProposal}
      />
      <Staking
        stakedTokens={stakedTokens}
        onStake={handleStakeTokens}
        onUnstake={handleUnstakeTokens}
        onClaimRewards={handleClaimRewards}
      />
      <UserInfo name={userName} activity={activity} />
    </div>
  );
}

export default App;


