import React from 'react';

const UserInfo = ({ name, activity }) => (
  <div className="user-info-container">
    <h2>User Info</h2>
    <p>Name: {name}</p>
    <p>Completed Modules: {activity.completedModules}</p>
    <p>Discussions: {activity.discussions}</p>
    <p>Content Created: {activity.contentCreated}</p>
    <p>Content Updated: {activity.contentUpdated}</p>
    <p>Content Deleted: {activity.contentDeleted}</p>
  </div>
);

export default UserInfo;
