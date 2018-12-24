import React from 'react';
import PropTypes from 'prop-types';


class Grid extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      widthPerBeat, heightPerPitch, numPitch, numBeats, beatsPerBar
    } = this.props;
    return (widthPerBeat !== nextProps.widthPerBeat
      && heightPerPitch !== nextProps.heightPerPitch
      && numPitch !== nextProps.numPitch
      && numBeats !== nextProps.numBeats
      && beatsPerBar !== nextProps.beatsPerBar
    );
  }

  render() {
    const {
      widthPerBeat, heightPerPitch, numPitch, numBeats, beatsPerBar,
    } = this.props;
    const isBlackKey = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    return (
      <div>
        {Array.from(Array(numPitch), (v, k) => k).map(pitch => (
          <div
            key={pitch}
            style={{
              position: 'absolute',
              width: widthPerBeat * numBeats,
              height: heightPerPitch,
              top: heightPerPitch * (numPitch - pitch - 1),
              backgroundColor: isBlackKey[pitch % 12] ? '#EEEEEE' : '#FAFAFA',
            }}
          />))
        }
        {Array.from(Array(numPitch + 1), (v, k) => k).map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: widthPerBeat * numBeats,
              height: 1,
              top: heightPerPitch * i,
              backgroundColor: '#EEEEEE',
            }}
          />))
        }
        {Array.from(Array(numBeats + 1), (v, k) => k).map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: (i % beatsPerBar === 0) ? 4 : 1,
              height: heightPerPitch * numPitch,
              left: (i % beatsPerBar === 0) ? i * widthPerBeat - 2 : i * widthPerBeat,
              backgroundColor: '#AAAAAA',
            }}
          />))
        }
      </div>
    );
  }
}

Grid.propTypes = {
  widthPerBeat: PropTypes.number.isRequired,
  heightPerPitch: PropTypes.number.isRequired,
  numPitch: PropTypes.number.isRequired,
  numBeats: PropTypes.number.isRequired,
  beatsPerBar: PropTypes.number.isRequired,
};

Grid.defaultProps = {
  style: {},
};

export default Grid;
