import React from 'react';
import PropTypes from 'prop-types';


class PositionBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoverBeats: null,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      widthPerBeat, numBeats, beatsPerBar,
    } = this.props;
    const { hoverBeats } = this.state;
    return (widthPerBeat !== nextProps.widthPerBeat
      || numBeats !== nextProps.numBeats
      || beatsPerBar !== nextProps.beatsPerBar
      || hoverBeats !== nextState.hoverBeats
    );
  }

  handleMouseDown(event) {
    const {
      widthPerBeat, onChangeStartBeat, quantizeBeats,
    } = this.props;
    const beats = quantizeBeats
      * Math.round((event.nativeEvent.offsetX / widthPerBeat) / quantizeBeats);
    onChangeStartBeat(beats);
  }

  handleMouseMove(event) {
    const {
      widthPerBeat, quantizeBeats,
    } = this.props;
    const beats = quantizeBeats
      * Math.round((event.nativeEvent.offsetX / widthPerBeat) / quantizeBeats);
    this.setState({
      hoverBeats: beats,
    });
  }

  handleMouseLeave() {
    this.setState({
      hoverBeats: null,
    });
  }

  render() {
    const { widthPerBeat, numBeats, beatsPerBar } = this.props;
    const { hoverBeats } = this.state;
    return (
      <div
        style={{
          height: '100%',
          width: widthPerBeat * numBeats,
          backgroundColor: '#FAFAFA',
        }}
      >
        {Array.from(Array(numBeats + 1), (v, k) => k).map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: (i % beatsPerBar === 0) ? 4 : 2,
              height: '100%',
              left: (i % beatsPerBar === 0) ? i * widthPerBeat - 2 : i * widthPerBeat - 1,
              backgroundColor: '#AAAAAA',
            }}
          />))
        }
        {(hoverBeats !== null) ? (
          <div
            style={{
              position: 'absolute',
              width: 3,
              height: '100%',
              left: hoverBeats * widthPerBeat,
              backgroundColor: '#AAAAAA',
            }}
          />
        ) : null}
        <div
          role="presentation"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            opacity: 0.0,
            zIndex: 1,
            cursor: 'pointer',
          }}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
        />
      </div>
    );
  }
}

PositionBar.propTypes = {
  widthPerBeat: PropTypes.number.isRequired,
  numBeats: PropTypes.number.isRequired,
  beatsPerBar: PropTypes.number.isRequired,
  quantizeBeats: PropTypes.number.isRequired,
  onChangeStartBeat: PropTypes.func.isRequired,
};

export default PositionBar;
