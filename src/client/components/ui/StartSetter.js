import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';


class StartSetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverBeats: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleClick(event) {
    const { totalBeat, onChangeStartBeat } = this.props;
    let newStartBeat = event.nativeEvent.offsetX / event.target.clientWidth * totalBeat;
    newStartBeat = Math.round(newStartBeat);
    onChangeStartBeat(newStartBeat);
  }

  handleMouseMove(event) {
    const { totalBeat } = this.props;
    let hoverBeats = event.nativeEvent.offsetX / event.target.clientWidth * totalBeat;
    hoverBeats = Math.round(hoverBeats / 4) * 4;
    this.setState({
      hoverBeats,
    });
  }

  handleMouseLeave() {
    this.setState({
      hoverBeats: null,
    });
  }

  render() {
    const { startBeat, totalBeat, style } = this.props;
    const { hoverBeats } = this.state;
    return (
      <Tooltip title="クリックして再生位置を指定" placement="top">
        <div
          style={style}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: '#F0F0FF'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 10,
              height: '100%',
              background: '#3f51b5',
              left: style.width * startBeat / totalBeat - 5,
            }}
          />
          {(hoverBeats !== null) ? (
            <div
              style={{
                position: 'absolute',
                width: 10,
                height: '100%',
                background: '#3f51b5',
                opacity: 0.3,
                left: style.width * hoverBeats / totalBeat - 5,
              }}
            />
          ) : null
          }
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
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
          />
        </div>
      </Tooltip>
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
