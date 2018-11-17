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
      width: 4,
      height,
      backgroundColor: '#3f51b5',
      position: 'absolute',
      top: 0,
      left: currentPosition - (4 / 2 - 1),
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
