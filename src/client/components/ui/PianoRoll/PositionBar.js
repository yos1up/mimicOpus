import React from 'react';
import PropTypes from 'prop-types';


class PositionBar extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      widthPerBeat, numBeats, beatsPerBar,
    } = this.props;
    return (widthPerBeat !== nextProps.widthPerBeat
      && numBeats !== nextProps.numBeats
      && beatsPerBar !== nextProps.beatsPerBar
    );
  }

  render() {
    const { widthPerBeat, numBeats, beatsPerBar } = this.props;
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
              width: (i % beatsPerBar === 0) ? 4 : 1,
              height: '100%',
              left: (i % beatsPerBar === 0) ? i * widthPerBeat - 2 : i * widthPerBeat,
              backgroundColor: '#AAAAAA',
            }}
          />))
        }
      </div>
    );
  }
}

PositionBar.propTypes = {
  widthPerBeat: PropTypes.number.isRequired,
  numBeats: PropTypes.number.isRequired,
  beatsPerBar: PropTypes.number.isRequired,
};

export default PositionBar;
