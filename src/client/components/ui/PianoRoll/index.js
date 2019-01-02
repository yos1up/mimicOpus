import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import Grid from './Grid';
import PitchBar from './PitchBar';
import PositionBar from './PositionBar';
import Note from '../../../data/note';
import device from './device';


class PianoRoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
      xScroll: false,
      yScroll: false,
      scrollTop: 0,
      scrollLeft: 0,
      inputStart: null,
      inputPitch: null,
      inputEnd: null,
    };

    this.handleMainGridWheel = this.handleMainGridWheel.bind(this);
    this.handlePitchBarWheel = this.handlePitchBarWheel.bind(this);
    this.handlePositionBarWheel = this.handlePositionBarWheel.bind(this);
  }

  componentDidMount() {
    const {
      pitchBarWidth, positionBarHeight, widthPerBeat, heightPerPitch,
      numPitch, numBeats,
    } = this.props;
    this.setState({
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
      mainGridWidth: this.element.offsetWidth - pitchBarWidth,
      mainGridHeight: this.element.offsetHeight - positionBarHeight,
      xScroll: (this.element.offsetWidth - pitchBarWidth) < (widthPerBeat * numBeats),
      yScroll: (this.element.offsetHeight - positionBarHeight) < (heightPerPitch * numPitch),
      scrollTop: -71 * heightPerPitch + this.element.offsetHeight,
    });
  }

  handleMainGridWheel(e) {
    const {
      widthPerBeat, numBeats, heightPerPitch, numPitch,
    } = this.props;
    const {
      scrollTop, scrollLeft, mainGridWidth, mainGridHeight, xScroll, yScroll
    } = this.state;
    e.preventDefault();
    let newScrollTop = scrollTop;
    let newScrollLeft = scrollLeft;

    if (xScroll) {
      newScrollLeft -= e.deltaX;
      newScrollLeft = Math.min(0, newScrollLeft);
      newScrollLeft = Math.max(-widthPerBeat * numBeats + mainGridWidth, newScrollLeft);
    }
    if (yScroll) {
      newScrollTop -= e.deltaY;
      newScrollTop = Math.min(0, newScrollTop);
      newScrollTop = Math.max(-heightPerPitch * numPitch + mainGridHeight, newScrollTop);
    }
    this.setState({
      scrollTop: newScrollTop,
      scrollLeft: newScrollLeft,
    });
  }

  handlePitchBarWheel(e) {
    const {
      heightPerPitch, numPitch,
    } = this.props;
    const {
      scrollTop, mainGridHeight, yScroll
    } = this.state;
    e.preventDefault();
    let newScrollTop = scrollTop;

    if (yScroll) {
      newScrollTop -= e.deltaY;
      newScrollTop = Math.min(0, newScrollTop);
      newScrollTop = Math.max(-heightPerPitch * numPitch + mainGridHeight, newScrollTop);
    }
    this.setState({
      scrollTop: newScrollTop,
    });
  }

  handlePositionBarWheel(e) {
    const {
      widthPerBeat, numBeats,
    } = this.props;
    const {
      scrollLeft, mainGridWidth, xScroll,
    } = this.state;
    e.preventDefault();
    let newScrollLeft = scrollLeft;

    if (xScroll) {
      newScrollLeft -= e.deltaX;
      newScrollLeft = Math.min(0, newScrollLeft);
      newScrollLeft = Math.max(-widthPerBeat * numBeats + mainGridWidth, newScrollLeft);
    }
    this.setState({
      scrollLeft: newScrollLeft,
    });
  }

  render() {
    const {
      style, pitchBarWidth, positionBarHeight, widthPerBeat, heightPerPitch,
      numPitch, numBeats, beatsPerBar, notes, deleteNote, currentBeats, startBeats,
      addNote, quantizeBeats, previewSound, onChangeStartBeat,
    } = this.props;
    const {
      width, height, scrollTop, scrollLeft, mainGridWidth, mainGridHeight,
      inputStart, inputEnd, inputPitch,
    } = this.state;
    const pianoRollStyle = {
      height: 400,
      width: 1000,
      boxShadow: '1px 1px 5px gray',
    };
    Object.assign(pianoRollStyle, style);
    return (
      <div
        id="pianoRoll"
        style={pianoRollStyle}
        ref={(element) => { this.element = element; }}
      >
        <div
          id="positionBar"
          style={{
            position: 'absolute',
            overflow: 'hidden',
            left: pitchBarWidth,
            top: 0,
            width: mainGridWidth,
            height: positionBarHeight,
          }}
          onWheel={this.handlePositionBarWheel}
        >
          <div
            style={{
              position: 'absolute',
              left: scrollLeft,
              height: '100%',
            }}
          >
            <PositionBar
              widthPerBeat={widthPerBeat}
              numBeats={numBeats}
              beatsPerBar={beatsPerBar}
              onChangeStartBeat={onChangeStartBeat}
              quantizeBeats={quantizeBeats}
            />
          </div>
        </div>
        <div
          id="pitchBar"
          style={{
            position: 'absolute',
            overflow: 'hidden',
            left: 0,
            top: positionBarHeight,
            width: pitchBarWidth,
            height: mainGridHeight,
          }}
          onWheel={this.handlePitchBarWheel}
        >
          <div
            style={{
              position: 'absolute',
              top: scrollTop,
              width: '100%',
            }}
          >
            <PitchBar
              heightPerPitch={heightPerPitch}
              numPitch={numPitch}
              previewSound={previewSound}
            />
          </div>
        </div>
        <div
          id="mainGrid"
          style={{
            position: 'absolute',
            left: pitchBarWidth,
            top: positionBarHeight,
            width: mainGridWidth,
            height: mainGridHeight,
            overflow: 'hidden',
          }}
          onWheel={this.handleMainGridWheel}
        >
          <div
            style={{
              position: 'absolute',
              left: scrollLeft,
              top: scrollTop,
            }}
          >
            <Grid
              widthPerBeat={widthPerBeat}
              heightPerPitch={heightPerPitch}
              numPitch={numPitch}
              numBeats={numBeats}
              beatsPerBar={beatsPerBar}
              quantizeBeats={quantizeBeats}
              onDragStart={(beats, pitch) => {
                const quantizedBeats = quantizeBeats * Math.floor(beats / quantizeBeats);
                previewSound(pitch);
                this.setState({
                  inputStart: quantizedBeats,
                  inputEnd: quantizedBeats + quantizeBeats,
                  inputPitch: pitch
                });
              }}
              onDrag={(beats) => {
                const quantizedBeats = quantizeBeats * Math.floor(beats / quantizeBeats);
                this.setState({
                  inputEnd: quantizedBeats + quantizeBeats,
                });
              }}
              onDragEnd={(beats) => {
                const quantizedBeats = quantizeBeats * Math.floor(beats / quantizeBeats);
                const note = new Note({
                  start: inputStart,
                  end: quantizedBeats + quantizeBeats,
                  pitch: inputPitch,
                });
                if (note.start < note.end) {
                  addNote(note);
                }
                this.setState({
                  inputStart: null,
                  inputEnd: null,
                  inputPitch: null
                });
              }}
              onDragCancel={() => {
                this.setState({
                  inputStart: null,
                  inputEnd: null,
                  inputPitch: null
                });
              }}
            />
            {notes.map((note, idx) => {
              const { pitch, start, end } = note;
              return (
                <div
                  key={idx}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: start * widthPerBeat,
                      top: numPitch * heightPerPitch - (pitch + 1) * heightPerPitch,
                      width: (end - start) * widthPerBeat - 2,
                      height: heightPerPitch - 1,
                      backgroundColor: 'blue',
                      opacity: 0.5,
                      borderRadius: 3,
                      boxShadow: '2px 2px 3px #DDDDDD',
                    }}
                  />
                  <div
                    role="button"
                    tabIndex="0"
                    style={{
                      position: 'absolute',
                      left: start * widthPerBeat,
                      top: numPitch * heightPerPitch - (pitch + 1) * heightPerPitch,
                      width: (end - start) * widthPerBeat,
                      height: heightPerPitch,
                      backgroundColor: '#FFFFFF',
                      opacity: 0,
                      zIndex: 2,
                    }}
                    onMouseDown={() => {
                      deleteNote(idx);
                    }}
                  />
                </div>
              );
            })}
            <div
              id="inputNote"
              style={{
                position: 'absolute',
                left: inputStart * widthPerBeat,
                top: numPitch * heightPerPitch - (inputPitch + 1) * heightPerPitch,
                width: (inputEnd - inputStart) * widthPerBeat,
                height: heightPerPitch,
                backgroundColor: 'blue',
                opacity: 0.2,
              }}
            />
          </div>
        </div>
        <div
          id="start"
          style={{
            position: 'absolute',
            height,
            width: 3,
            left: startBeats * widthPerBeat + scrollLeft + pitchBarWidth,
            backgroundColor: '#888888',
          }}
        />
        <div
          id="position"
          style={{
            position: 'absolute',
            height,
            width: 5,
            left: currentBeats * widthPerBeat + scrollLeft + pitchBarWidth,
            backgroundColor: '#555555',
          }}
        />
      </div>
    );
  }
}

PianoRoll.propTypes = {
  widthPerBeat: PropTypes.number,
  heightPerPitch: PropTypes.number,
  numPitch: PropTypes.number,
  numBeats: PropTypes.number,
  quantizeBeats: PropTypes.number,
  beatsPerBar: PropTypes.number,
  notes: PropTypes.instanceOf(Immutable.List),
  style: PropTypes.object,
  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  pitchBarWidth: PropTypes.number,
  positionBarHeight: PropTypes.number,
  currentBeats: PropTypes.number,
  startBeats: PropTypes.number,
  previewSound: PropTypes.func,
  onChangeStartBeat: PropTypes.func,
};

PianoRoll.defaultProps = {
  widthPerBeat: 58,
  heightPerPitch: 22,
  numPitch: 128,
  numBeats: 16,
  beatsPerBar: 4,
  quantizeBeats: 0.5,
  notes: Immutable.List(),
  style: {},
  addNote: () => {},
  deleteNote: () => {},
  positionBarHeight: 30,
  pitchBarWidth: 70,
  currentBeats: 0,
  startBeats: 0,
  previewSound: () => {},
  onChangeStartBeat: () => {},
};

export default PianoRoll;
