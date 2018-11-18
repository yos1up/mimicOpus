import React from 'react';
import PropTypes from 'prop-types';


/* script type='text/babel' */
class SimpleGrid extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      rows, cols, uw, uh, hlw, vlw, bgr,
    } = this.props;
    const {
      rows_, cols_, uw_, uh_, hlw_, vlw_, bgr_,
    } = nextProps;
    const rdiff = (rows !== rows_);
    const cdiff = (cols !== cols_);
    const uwdiff = (uw !== uw_);
    const uhdiff = (uh !== uh_);
    const hdiff = (hlw !== hlw_);
    const vdiff = (vlw !== vlw_);
    const bgrdiff = (bgr !== bgr_);

    return rdiff || cdiff || uwdiff || uhdiff || hdiff || vdiff || bgrdiff;
  }

  render() { // グリッドエリア内のみ．
    /*
    rows: 行数 (number)
    cols: 列数 (number)
    uw: 1列の幅 (number)
    uh: 1行の幅 (number)
    hlw: 水平線の幅 (長さ row+1 の array) (指定ない場合は全て 1 になる)
    vlw: 垂直線の幅 (長さ col+1 の array) (指定ない場合は全て 1 になる)
    bgr: 各行の背景色 (長さ row+1 の array．各要素の例：'#DDDDFF' (青色になる) null (描画されない)) (指定ない場合は描画されない)
    */
    const {
      rows, cols, uw, uh, hlw, vlw, bgr,
    } = this.props;
    const elementList = [];
    const width = uw * cols;
    const height = uh * rows;

    // horizontal background color
    if (typeof bgr !== 'undefined') {
      for (let i = 0; i < rows; i += 1) {
        const bgColor = bgr[i % bgr.length];
        if (bgColor !== null) {
          const divStyle = {
            width,
            height: uh,
            backgroundColor: bgColor,
            position: 'absolute',
            top: i * uh,
            left: 0,
          };
          elementList.push(<div key={elementList.length} style={divStyle} />);
        }
      }
    }
    for (let i = 0; i <= rows; i += 1) { // horizontal lines
      let lw = 1;
      let backgroundColor = 'black';
      if (typeof hlw !== 'undefined') {
        lw = hlw[i % hlw.length];
        if (lw < 1) {
          const c = Math.floor(255 * (1 - lw));
          backgroundColor = `rgb(${c},${c},${c})`;
          lw = 1;
        }
      }
      const divStyle = {
        width,
        height: lw,
        backgroundColor,
        position: 'absolute',
        top: i * uh,
        left: 0,
      };
      elementList.push(<div key={elementList.length} style={divStyle} />);
    }
    for (let j = 0; j <= cols; j += 1) { // vertical lines
      let lw = 1;
      let backgroundColor = 'black';
      if (typeof vlw !== 'undefined') {
        lw = vlw[j % vlw.length];
        if (lw < 1) {
          const c = Math.floor(255 * (1 - lw));
          backgroundColor = `rgb(${c},${c},${c})`;
          lw = 1;
        }
      }
      const divStyle = {
        width: lw,
        height,
        backgroundColor,
        position: 'absolute',
        top: 0,
        left: j * uw,
      };
      elementList.push(<div key={elementList.length} style={divStyle} />);
    }
    return (<div>{elementList}</div>);
  }
}

SimpleGrid.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  uw: PropTypes.number.isRequired,
  uh: PropTypes.number.isRequired,
  hlw: PropTypes.arrayOf(PropTypes.number).isRequired,
  vlw: PropTypes.arrayOf(PropTypes.number).isRequired,
  bgr: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SimpleGrid;
