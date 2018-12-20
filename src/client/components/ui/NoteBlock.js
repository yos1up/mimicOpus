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

  shouldComponentUpdate(nextProps) {
    const {
      start, end, uw, uh, beatPerCol,
    } = this.props;
    const {
      start_, end_, uw_, uh_, beatPerCol_,
    } = nextProps;
    const sdiff = (start !== start_);
    const ediff = (end !== end_);
    const wdiff = (uw !== uw_);
    const hdiff = (uh !== uh_);
    const bpcdiff = (beatPerCol !== beatPerCol_);
    return sdiff || ediff || wdiff || hdiff || bpcdiff;
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
    return (
      <Tooltip title="クリックして音を削除">
        <div
          style={{
            width: uw * (end - start) / beatPerCol,
            height: uh,
            backgroundColor: 'rgba(0,0,0,0.0)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onMouseDown={this.handleClick}
          role="button"
          tabIndex="0"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'blue',
              borderRadius: 10,
              top: 0,
              left: 0,
              opacity: 0.5,
            }}
          />
        </div>
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
