import React from 'react';

const Staking = ({ stakedTokens, onStake, onUnstake, onClaimRewards }) => (
  <div>
    <h2>Staking</h2>
    <p>Staked Tokens: {stakedTokens}</p>
    <button onClick={() => onStake(50)}>Stake 50 Tokens</button>
    <button onClick={() => onUnstake(50)}>Unstake 50 Tokens</button>
    <button onClick={onClaimRewards}>Claim Rewards</button>
  </div>
);

export default Staking;
