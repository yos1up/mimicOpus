import React from 'react';
import PropTypes from 'prop-types';


class PitchBar extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      heightPerPitch, numPitch,
    } = this.props;
    return (heightPerPitch !== nextProps.heightPerPitch
      || numPitch !== nextProps.numPitch
    );
  }

  render() {
    const { heightPerPitch, numPitch, previewSound } = this.props;
    const numOctave = parseInt((numPitch - 1) / 12, 10) + 1;
    const octaveHeight = heightPerPitch * 12;
    const isBlack = [0, 1, 1, 0, 1, 1, 1];
    const blackPitch = [null, 1, 3, null, 6, 8, 10];
    const whitePitch = [0, 2, 4, 5, 7, 9, 11];

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
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: octaveHeight / 7,
                  top: heightPerPitch * (numPitch) - octave * octaveHeight
                    - (pitch + 1) * (octaveHeight / 7),
                  backgroundColor: '#FFFFFF',
                  opacity: 0,
                  zIndex: 1,
                  cursor: 'pointer',
                }}

                onMouseDown={() => {
                  previewSound(12 * octave + whitePitch[pitch]);
                }}
              >
                {pitch}
              </div>
              {(isBlack[pitch] === 1) ? (
                <div
                  style={{
                    position: 'absolute',
                    width: '50%',
                    height: octaveHeight / 7 * 0.6,
                    top: heightPerPitch * (numPitch) - octave * octaveHeight
                      - (pitch + 0.3) * (octaveHeight / 7),
                    backgroundColor: '#777777',
                    borderRadius: '3px',
                    boxShadow: '1px 1px 3px gray',
                    zIndex: 2,
                    cursor: 'pointer',
                  }}

                  onMouseDown={() => {
                    previewSound(12 * octave + blackPitch[pitch]);
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
  previewSound: PropTypes.func,
};

export default PitchBar;
