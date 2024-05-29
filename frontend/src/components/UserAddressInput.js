import React from 'react';

const UserAddressInput = ({ userAddress, onAddressChange, onBalanceCheck }) => (
  <div className="user-address-input">
    <label htmlFor="userAddress">User Address:</label>
    <input type="text" id="userAddress" value={userAddress} onChange={onAddressChange} />
    <button onClick={onBalanceCheck}>Check Balance</button>
  </div>
);

export default UserAddressInput;
