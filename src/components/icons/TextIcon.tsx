import React from 'react';

const emptyIcon = require('./iconAssets/empty-text.png');
const textIcon = require('./iconAssets/text.png');

type TextIconProps = {
  changed: boolean;
};

const TextIcon = ({ changed }: TextIconProps) =>
  changed ? (
    <img
      src={textIcon}
      alt="Text Icon"
      style={{ backgroundColor: 'lightGreen', width: '20px', height: '20px' }}
    />
  ) : (
    <img
      src={emptyIcon}
      alt="Empty Icon"
      style={{ width: '20px', height: '20px' }}
    />
  );

export default TextIcon;
