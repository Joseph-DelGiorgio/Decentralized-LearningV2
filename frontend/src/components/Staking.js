import React, { useState } from 'react';

const Staking = ({ stakedTokens, onStake, onUnstake, onClaimRewards }) => {
  const [stakeAmount, setStakeAmount] = useState(50);
  const [unstakeAmount, setUnstakeAmount] = useState(50);

  const handleStakeChange = (e) => setStakeAmount(Number(e.target.value));
  const handleUnstakeChange = (e) => setUnstakeAmount(Number(e.target.value));

  return (
    <div className="staking-container">
      <h2>Staking</h2>
      <p>Staked Tokens: {stakedTokens}</p>
      <div>
        <input
          type="number"
          value={stakeAmount}
          onChange={handleStakeChange}
          min="1"
        />
        <button onClick={() => onStake(stakeAmount)}>Stake Tokens</button>
      </div>
      <div>
        <input
          type="number"
          value={unstakeAmount}
          onChange={handleUnstakeChange}
          min="1"
        />
        <button onClick={() => onUnstake(unstakeAmount)}>Unstake Tokens</button>
      </div>
      <button onClick={onClaimRewards}>Claim Rewards</button>
    </div>
  );
};

export default Staking;
