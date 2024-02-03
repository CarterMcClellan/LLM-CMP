import React from 'react';
const emptyIcon = require('./iconAssets/empty-text.png');

const EmptyIcon = () => (
  <img
    src={emptyIcon}
    alt="Empty Icon"
    style={{ width: '20px', height: '20px' }}
  />
);

export default EmptyIcon;
