import React from 'react';

const TokenMinting = ({ canMint, onMint, tokenMinted }) => (
  <div className="token-minting">
    <button onClick={onMint} disabled={!canMint}>Mint Tokens</button>
    {tokenMinted && <p>Tokens successfully minted!</p>}
  </div>
);

export default TokenMinting;
