import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import UserAddressInput from './components/UserAddressInput';
import UserBalance from './components/UserBalance';
import TokenMinting from './components/TokenMinting';
import DAOProposals from './components/DAOProposals';
import Staking from './components/Staking';
import UserInfo from './components/UserInfo';

function App() {
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
    async function fetchData() {
      if (userAddress) {
        await fetchUserInfo();
        await fetchUserBalance();
        await fetchUserActivity();
      }
    }

    fetchData();
  }, [userAddress]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`/api/users/${userAddress}`);
      const data = response.data;
      setUserName(data.name);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await axios.get(`/api/tokens/balance/${userAddress}`);
      const balance = response.data.balance;
      setUserBalance(balance);
      setCanMint(balance >= 100);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  const fetchUserActivity = async () => {
    try {
      const response = await axios.get(`/api/users/activity/${userAddress}`);
      const activity = response.data;
      setActivity({
        completedModules: activity.completedModules,
        discussions: activity.discussions,
        contentCreated: activity.contentCreated,
        contentUpdated: activity.contentUpdated,
        contentDeleted: activity.contentDeleted,
      });
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const handleUserAddressChange = (event) => {
    setUserAddress(event.target.value);
  };

  const handleTokenMint = async () => {
    try {
      await axios.post('/api/tokens/mint', {
        address: userAddress,
        amount: 100,
      });
      setTokenMinted(true);
      await fetchUserBalance();
    } catch (error) {
      console.error('Error minting tokens:', error);
    }
  };

  const handleFetchDAOProposals = async () => {
    try {
      const response = await axios.get('/api/dao/proposals');
      setDAOProposals(response.data);
    } catch (error) {
      console.error('Error fetching DAO proposals:', error);
    }
  };

  const handleSelectProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleStakeTokens = async (amount) => {
    try {
      await axios.post('/api/staking/stake', {
        address: userAddress,
        amount,
      });
      await fetchUserBalance();
      await fetchUserActivity();
    } catch (error) {
      console.error('Error staking tokens:', error);
    }
  };

  const handleUnstakeTokens = async (amount) => {
    try {
      await axios.post('/api/staking/unstake', {
        address: userAddress,
        amount,
      });
      await fetchUserBalance();
      await fetchUserActivity();
    } catch (error) {
      console.error('Error unstaking tokens:', error);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await axios.post('/api/staking/claim', {
        address: userAddress,
      });
      await fetchUserBalance();
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Learning DApp</h1>
      <UserAddressInput
        userAddress={userAddress}
        onAddressChange={handleUserAddressChange}
        onBalanceCheck={fetchUserBalance}
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



