import React from 'react';

const DAOProposals = ({ proposals, onFetchProposals, onSelectProposal, selectedProposal }) => (
  <div className="dao-proposals">
    <h2>DAO Governance</h2>
    <button onClick={onFetchProposals}>Fetch Proposals</button>
    <ul>
      {proposals.map((proposal, index) => (
        <li key={index} onClick={() => onSelectProposal(proposal)}>
          {proposal.title}
        </li>
      ))}
    </ul>
    {selectedProposal && (
      <div className="selected-proposal">
        <h3>{selectedProposal.title}</h3>
        <p>{selectedProposal.description}</p>
        <button>Vote</button>
      </div>
    )}
  </div>
);

export default DAOProposals;
