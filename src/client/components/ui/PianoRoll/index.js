import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import Grid from './Grid';
import PitchBar from './PitchBar';


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
    };

    this.handleMainGridWheel = this.handleMainGridWheel.bind(this);
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

  render() {
    const {
      style, pitchBarWidth, positionBarHeight, widthPerBeat, heightPerPitch,
      numPitch, numBeats, beatsPerBar,
    } = this.props;
    const {
      width, height, scrollTop, scrollLeft, xScroll, yScroll, mainGridWidth, mainGridHeight,
    } = this.state;
    const pianoRollStyle = {
      height: 400,
      width: 1000,
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
            width: width - pitchBarWidth,
            height: positionBarHeight,
          }}
        />
        <div
          id="pitchBar"
          style={{
            position: 'absolute',
            overflow: 'hidden',
            left: 0,
            top: positionBarHeight,
            width: pitchBarWidth,
            height: height - positionBarHeight,
          }}
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
            />
          </div>
        </div>
        <div
          id="mainGrid"
          style={{
            position: 'absolute',
            left: pitchBarWidth,
            top: positionBarHeight,
            width: width - pitchBarWidth,
            height: height - positionBarHeight,
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
            />
          </div>
        </div>
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
  pitchName: PropTypes.object,
  pitchBarWidth: PropTypes.number,
  positionBarHeight: PropTypes.number,
};

PianoRoll.defaultProps = {
  widthPerBeat: 58,
  heightPerPitch: 20,
  numPitch: 128,
  numBeats: 16,
  beatsPerBar: 4,
  quantizeBeats: 0.5,
  notes: Immutable.List(),
  style: {},
  addNote: () => {},
  deleteNote: () => {},
  pitchName: Array.from(Array(128), (v, k) => k).map((pitch) => {
    const pitchName = ['C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B'];
    let label = pitchName[pitch % 12];
    if (label === 'C') label += (pitch / 12 - 1);
    return label;
  }),
  positionBarHeight: 50,
  pitchBarWidth: 70,
};

export default PianoRoll;
