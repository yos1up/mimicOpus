import React from 'react';
import PropTypes from 'prop-types';


class PitchBar extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      heightPerPitch, numPitch,
    } = this.props;
    return (heightPerPitch !== nextProps.heightPerPitch
      && numPitch !== nextProps.numPitch
    );
  }

  render() {
    const { heightPerPitch, numPitch } = this.props;
    const numOctave = parseInt((numPitch - 1) / 12, 10) + 1;
    const octaveHeight = heightPerPitch * 12;
    const isBlack = [0, 1, 1, 0, 1, 1, 1];

    return (
      <div
        style={{
          width: '100%',
          height: heightPerPitch * numPitch,
          backgroundColor: '#FAFAFA',
        }}
      >
        {Array.from(Array(numOctave), (v, k) => k).map(octave => (
          Array.from(Array(7), (v, k) => k).map(pitch => (
            <div>
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 1,
                  top: heightPerPitch * (numPitch) - octave * octaveHeight
                    - pitch * (octaveHeight / 7),
                  backgroundColor: '#EEEEEE',
                }}
              />
              {(isBlack[pitch] === 1) ? (
                <div
                  style={{
                    position: 'absolute',
                    width: '50%',
                    height: octaveHeight / 7 * 0.6,
                    top: heightPerPitch * (numPitch) - octave * octaveHeight
                      - (pitch + 0.3) * (octaveHeight / 7),
                    backgroundColor: '#777777',
                  }}
                />
              ) : null}
            </div>
          ))
        ))}
        {Array.from(Array(numOctave), (v, k) => k).map(octave => (
          <div
            style={{
              position: 'absolute',
              top: heightPerPitch * (numPitch) - octave * octaveHeight - heightPerPitch,
              width: '100%'
            }}
          >
            <div
              style={{
                textAlign: 'right',
                color: '#555555',
              }}
            >
              {`C${octave - 1}`}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

PitchBar.propTypes = {
  heightPerPitch: PropTypes.number.isRequired,
  numPitch: PropTypes.number.isRequired,
};

export default PitchBar;
