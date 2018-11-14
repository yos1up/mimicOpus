import React from 'react';
import PropTypes from 'prop-types';


class PositionBar extends React.Component { // 現在の再生位置を示す縦棒
  /*
    height: 縦棒の長さ
    barX: x絶対座標
  */
  constructor(props) {
    super(props);
    this.state = {
      barX: null,
    };
  }

  updateCurrentPosition(x) {
    this.setState({ barX: x });
  }

  render() {
    const { height, } = this.props;
    const { barX, } = this.state;

    if (barX) {
      const divStyle = {
        width: 2,
        height,
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        left: barX,
        opacity: 0.5,
      };
      return (
        <div
          style={divStyle}
        />
      );
    }
    return null;
  }
}

PositionBar.propTypes = {
  height: PropTypes.number.isRequired,
};

export default PositionBar;
