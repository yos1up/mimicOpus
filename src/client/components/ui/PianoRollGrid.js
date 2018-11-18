import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import SimpleGrid from './SimpleGrid';
import NoteBlock from './NoteBlock';
import PositionBar from './PositionBar';
import Note from '../../data/note';

class PianoRollGrid extends React.Component { // グリッドエリア + yラベル
  constructor(props) {
    super(props);
    this.state = {
      uw: 28, // unit width (1 column width)
      uh: 20, // unit height (1 row height)
      rows: 128,
      cols: 32,
      xMargin: 36,
      selectRange: null,
      beatPerCol: 0.5, // グリッド刻み（拍数）
      toSetScrollTop: true,
    };

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
  }

  componentDidMount() {
    const { toSetScrollTop } = this.state;
    if (toSetScrollTop) {
      this.overflowDiv.scrollTop = 1040;
      this.toSetScrollTop = false;
      this.setState({
        toSetScrollTop: false,
      });
    }
  }

  mouseDown(event) {
    const { xMargin } = this.state;

    // 要素の位置を取得
    const clientRect = this.mainPianoRoll.getBoundingClientRect();
    const originPos = [
      clientRect.left + window.pageXOffset + xMargin,
      clientRect.top + window.pageYOffset,
    ];
    const relPos = [
      event.pageX - originPos[0],
      event.pageY - originPos[1],
    ];
    this.setState({
      dragInfo: {
        originPos,
        startRelPos: relPos,
      },
      selectRange: this.calculateSelectRangeByTwoRelPos(relPos, relPos),
    });
  }

  mouseMove(event) {
    const { dragInfo } = this.state;
    if (dragInfo !== undefined) {
      const currentRelPos = [
        event.pageX - dragInfo.originPos[0],
        event.pageY - dragInfo.originPos[1],
      ];
      this.setState({
        selectRange: this.calculateSelectRangeByTwoRelPos(dragInfo.startRelPos, currentRelPos),
      });
    }
  }

  mouseUp() {
    const { addNote, soundPlayer } = this.props;
    const { selectRange } = this.state;

    // ノーツを発生させる
    if (selectRange !== null) {
      if (selectRange[0] < selectRange[2]) { // 長さゼロ区間の場合を除く
        if (soundPlayer) { // 音プレビュー
          soundPlayer.preview(selectRange[1]);
        }
        const note = new Note({
          start: selectRange[0],
          end: selectRange[2],
          pitch: selectRange[1],
        });
        addNote(note);
        this.setState({ dragInfo: undefined, selectRange: null });
      }
    }
  }

  relPosToBeatPitch(relPos) { // relPos: グリッド左上からの座標ずれ, beatPitch: 拍とピッチ
    const { uw, uh, beatPerCol } = this.state;
    return [
      relPos[0] / uw * beatPerCol,
      127 + 0.5 - relPos[1] / uh,
    ];
  }

  beatPitchToRelPos(beatPitch) { // beatPitch: 拍とピッチ, relPos: グリッド左上からの座標ずれ
    const { uw, uh, beatPerCol } = this.state;
    return [
      beatPitch[0] / beatPerCol * uw,
      (127 + 0.5 - beatPitch[1]) * uh,
    ];
  }

  calculateSelectRangeByTwoRelPos(relPos1, relPos2, onePitch = true) {
    const { cols, beatPerCol } = this.state;

    const tp1 = this.relPosToBeatPitch(relPos1);
    const tp2 = this.relPosToBeatPitch(relPos2);
    let range;
    if (onePitch) {
      range = [
        Math.max(0, Math.floor(Math.min(tp1[0], tp2[0]) / beatPerCol) * beatPerCol),
        Math.max(0, Math.round(tp1[1])),
        Math.min(cols, Math.ceil(Math.max(tp1[0], tp2[0]) / beatPerCol) * beatPerCol),
        Math.min(127, Math.round(tp1[1])),
      ];
    } else {
      range = [
        Math.max(0, Math.floor(Math.min(tp1[0], tp2[0]) / beatPerCol) * beatPerCol),
        Math.max(0, Math.round(Math.min(tp1[1], tp2[1]))),
        Math.min(cols, Math.ceil(Math.max(tp1[0], tp2[0]) / beatPerCol) * beatPerCol),
        Math.min(127, Math.round(Math.max(tp1[1], tp2[1]))),
      ];
    }
    return range;
  }

  render() {
    const {
      notes, delNote, soundPlayer, currentBeat,
    } = this.props;
    const {
      rows, cols, uw, uh, xMargin, selectRange, beatPerCol,
    } = this.state;

    const elementList = [];

    // grid
    const isBlackKey = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    const bgr = [];
    for (let i = 0; i < rows; i += 1) {
      const pitch = 127 - i;
      bgr.push(isBlackKey[pitch % 12] ? '#EEEEFF' : '#FFFFFF');
    }
    const hlw = [...Array(rows + 1).keys()].map(i => 1 + (
      ((127 + 1 - i) % 12) ? 0 : 1
    ));
    const vlw = [...Array(cols + 1).keys()].map(
      i => 0.25 + ((i % 2) ? 0 : 0.75) + ((i % 8) ? 0 : 1)
    );
    elementList.push(
      <div
        key={elementList.length}
        style={{
          position: 'absolute',
          left: xMargin,
          width: uw * cols,
          height: uh * rows,
        }}
      >
        <SimpleGrid rows={rows} cols={cols} uw={uw} uh={uh} hlw={hlw} vlw={vlw} bgr={bgr} />
      </div>
    );

    // yLabel (i.e. pitch name)
    const pitchName = ['C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B'];
    for (let i = 0; i < rows; i += 1) {
      const pitch = 127 - i;
      let label = pitchName[pitch % 12];
      if (label === 'C') label += (pitch / 12 - 1);
      elementList.push(
        <div
          key={elementList.length}
          style={{
            position: 'absolute',
            left: 0,
            top: uh * i,
          }}
          draggable={false}
        >
          {label}
        </div>,
      );
    }

    // notes
    for (let i = 0; i < notes.size; i += 1) {
      const note = notes.get(i);
      if (note.pitch >= 0 && note.pitch <= 127) {
        const leftBottom = this.beatPitchToRelPos([
          note.start, note.pitch - 0.5,
        ]);
        const rightTop = this.beatPitchToRelPos([
          note.end, note.pitch + 0.5,
        ]);
        const divStyle = {
          position: 'absolute',
          top: rightTop[1],
          left: xMargin + leftBottom[0],
        };
        elementList.push(
          <div key={elementList.length} style={divStyle}>
            <NoteBlock
              start={note.start}
              end={note.end}
              uw={uw}
              beatPerCol={beatPerCol}
              uh={uh}
              pitch={note.pitch}
              parent={this}
              dictKey={i}
              delNote={() => delNote(i)}
            />
          </div>,
        );
      }
    }

    // current position bar
    elementList.push(
      <PositionBar
        soundPlayer={soundPlayer}
        height={uh * rows}
        parent={this}
        currentPosition={xMargin + this.beatPitchToRelPos([currentBeat, 0])[0]}
      />
    );

    // selection
    if (selectRange !== null) {
      // [startBeat (decimal), minPitch (integer), endBeat (decimal), maxPitch (integer)]
      const leftBottom = this.beatPitchToRelPos([
        selectRange[0], selectRange[1] - 0.5,
      ]);
      const rightTop = this.beatPitchToRelPos([
        selectRange[2], selectRange[3] + 0.5,
      ]);
      const divStyle = {
        width: rightTop[0] - leftBottom[0],
        height: leftBottom[1] - rightTop[1],
        border: '1px dashed #f00',
        borderRadius: 10,
        position: 'absolute',
        top: rightTop[1],
        left: xMargin + leftBottom[0],
      };
      elementList.push(<div key={elementList.length} style={divStyle} />);
    }

    return (
      <Tooltip title="ドラッグして音を入力">
        <div
          style={{
            position: 'absolute',
            top: 0,
            height: 400,
            width: xMargin + uw * cols + 2,
            overflowY: 'scroll',
          }}
          ref={(overflowDiv) => {
            this.overflowDiv = overflowDiv;
          }}
        >
          <div
            role="presentation"
            style={{
              position: 'absolute',
              top: 0,
              cursor: 'pointer',
            }}
            ref={(mainPianoRoll) => {
              this.mainPianoRoll = mainPianoRoll;
            }}
            onWheel={this.wheel}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
          >
            {elementList}
          </div>
        </div>
      </Tooltip>
    );
  }
}

PianoRollGrid.propTypes = {
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
  currentBeat: PropTypes.number.isRequired,
  addNote: PropTypes.func.isRequired,
  delNote: PropTypes.func.isRequired,
  soundPlayer: PropTypes.object.isRequired,
};

export default PianoRollGrid;
