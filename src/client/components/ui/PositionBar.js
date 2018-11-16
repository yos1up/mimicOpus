import React from 'react';
import PropTypes from 'prop-types';


function PositionBar(props) {
  const { height, currentPosition } = props;

  const divStyle = {
    width: 2,
    height,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: currentPosition,
    opacity: 0.5,
  };
  return (
    <div
      style={divStyle}
    />
  );
}

PositionBar.propTypes = {
  height: PropTypes.number.isRequired,
  currentPosition: PropTypes.number.isRequired,
};

export default PositionBar;
