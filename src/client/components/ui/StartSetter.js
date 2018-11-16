import React from 'react';
import PropTypes from 'prop-types';


class StartSetter extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { totalBeat, onChangeStartBeat } = this.props;
    let newStartBeat = event.nativeEvent.offsetX / event.target.clientWidth * totalBeat;
    newStartBeat = Math.round(newStartBeat);
    onChangeStartBeat(newStartBeat);
  }

  render() {
    const { startBeat, totalBeat, style } = this.props;
    return (
      <div
        style={style}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#FFFFFF'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 10,
            height: '100%',
            background: '#FF0000',
            left: style.width * startBeat / totalBeat,
          }}
        />
        <div
          role="presentation"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: '#FFFFFF',
            opacity: 0.0,
            zIndex: 10,
          }}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}


StartSetter.propTypes = {
  startBeat: PropTypes.number.isRequired,
  totalBeat: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  onChangeStartBeat: PropTypes.func.isRequired,
};

export default StartSetter;
