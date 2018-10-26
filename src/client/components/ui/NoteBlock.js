import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';


class NoteBlock extends React.Component { // ノーツ
  /*
    start: ノートオン時刻
    end: ノートオフ時刻
    pitch: ノートナンバー
    parent: 親 PianoRollGrid インスタンス．
  */
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { delNote } = this.props;
    // クリックイベントの親オブジェクトへの伝播を止める
    event.stopPropagation();
    delNote();
  }

  render() {
    const {
      start, end, uw, uh, beatPerCol,
    } = this.props;
    const divStyle = {
      width: uw * (end - start) / beatPerCol,
      height: uh,
      backgroundColor: 'blue',
      borderRadius: 10,
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0.5,
    };
    return (
      <Tooltip title="クリックして音を削除">
        <div
          style={divStyle}
          onMouseDown={this.handleClick}
          role="button"
          tabIndex="0"
        />
      </Tooltip>
    );
  }
}

NoteBlock.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  uw: PropTypes.number.isRequired,
  uh: PropTypes.number.isRequired,
  delNote: PropTypes.func.isRequired,
  beatPerCol: PropTypes.number.isRequired,
};

export default NoteBlock;
