import React from 'react';

const UserBalance = ({ balance }) => (
  <div>
    {balance > 0 && <p>Balance: {balance}</p>}
  </div>
);

export default UserBalance;
