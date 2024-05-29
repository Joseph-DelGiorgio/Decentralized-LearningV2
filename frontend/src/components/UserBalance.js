import React from 'react';

const UserBalance = ({ balance }) => (
  <div className="user-balance">
    {balance > 0 && <p>Balance: {balance}</p>}
  </div>
);

export default UserBalance;
