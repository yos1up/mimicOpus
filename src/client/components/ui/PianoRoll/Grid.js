import React from 'react';
import PropTypes from 'prop-types';


class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragged: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {
      widthPerBeat, heightPerPitch, numPitch, numBeats, beatsPerBar
    } = this.props;
    return (widthPerBeat !== nextProps.widthPerBeat
      || heightPerPitch !== nextProps.heightPerPitch
      || numPitch !== nextProps.numPitch
      || numBeats !== nextProps.numBeats
      || beatsPerBar !== nextProps.beatsPerBar
    );
  }

  handleMouseDown(event) {
    const {
      widthPerBeat, heightPerPitch, numPitch, onDragStart,
    } = this.props;
    this.setState({
      isDragged: true,
    });
    onDragStart(
      event.nativeEvent.offsetX / widthPerBeat,
      parseInt((heightPerPitch * numPitch - event.nativeEvent.offsetY) / heightPerPitch, 10)
    );
  }

  handleMouseMove(event) {
    const {
      widthPerBeat, heightPerPitch, numPitch, onDrag,
    } = this.props;
    const { isDragged } = this.state;
    if (isDragged) {
      onDrag(
        event.nativeEvent.offsetX / widthPerBeat,
        parseInt((heightPerPitch * numPitch - event.nativeEvent.offsetY) / heightPerPitch, 10)
      );
    }
  }

  handleMouseUp(event) {
    const {
      widthPerBeat, heightPerPitch, numPitch, onDragEnd,
    } = this.props;
    const { isDragged } = this.state;
    if (isDragged) {
      this.setState({
        isDragged: false,
      });
      onDragEnd(
        event.nativeEvent.offsetX / widthPerBeat,
        parseInt((heightPerPitch * numPitch - event.nativeEvent.offsetY) / heightPerPitch, 10)
      );
    }
  }

  handleMouseLeave(event) {
    const {
      widthPerBeat, heightPerPitch, numPitch, onDragCancel,
    } = this.props;
    const { isDragged } = this.state;
    if (isDragged) {
      this.setState({
        isDragged: false,
      });
      onDragCancel(
        event.nativeEvent.offsetX / widthPerBeat,
        parseInt((heightPerPitch * numPitch - event.nativeEvent.offsetY) / heightPerPitch, 10)
      );
    }
  }

  render() {
    const {
      widthPerBeat, heightPerPitch, numPitch, numBeats, beatsPerBar, quantizeBeats,
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
              width: (i % beatsPerBar === 0) ? 4 : 2,
              height: heightPerPitch * numPitch,
              left: (i % beatsPerBar === 0) ? i * widthPerBeat - 2 : i * widthPerBeat - 1,
              backgroundColor: '#AAAAAA',
            }}
          />))
        }
        {Array.from(Array(numBeats / quantizeBeats + 1), (v, k) => k).map((i) => {
          if ((i * quantizeBeats) % 1.0 > 0.0) {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 1,
                  height: heightPerPitch * numPitch,
                  left: (i * quantizeBeats) * widthPerBeat,
                  backgroundColor: '#CCCCCC',
                }}
              />
            );
          }
          return null;
        })
        }
        <div
          role="presentation"
          style={{
            position: 'absolute',
            width: widthPerBeat * numBeats,
            height: heightPerPitch * numPitch,
            backgroundColor: '#FFFFFF',
            opacity: 0.0,
            zIndex: 1,
            cursor: 'pointer',
          }}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
        />
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
  quantizeBeats: PropTypes.number.isRequired,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func,
};

Grid.defaultProps = {
  onDragStart: () => {},
  onDrag: () => {},
  onDragEnd: () => {},
  onDragCancel: () => {},
};

export default Grid;
