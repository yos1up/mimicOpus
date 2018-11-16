import React from 'react';
import PropTypes from 'prop-types';


class PositionBar extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { currentPosition, height } = this.props;
    const currentPosDiff = (nextProps.currentPosition !== currentPosition);
    const heightDiff = (nextProps.height !== height);
    return currentPosDiff || heightDiff;
  }

  render() {
    const { height, currentPosition } = this.props;

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
}

PositionBar.propTypes = {
  height: PropTypes.number.isRequired,
  currentPosition: PropTypes.number.isRequired,
};

export default PositionBar;
