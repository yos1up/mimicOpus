import React from 'react';
import PropTypes from 'prop-types';


/* script type='text/babel' */
function SimpleGrid({
  rows, cols, uw, uh, hlw, vlw, bgr,
}) { // グリッドエリア内のみ．
  /*
  rows: 行数 (number)
  cols: 列数 (number)
  uw: 1列の幅 (number)
  uh: 1行の幅 (number)
  hlw: 水平線の幅 (長さ row+1 の array) (指定ない場合は全て 1 になる)
  vlw: 垂直線の幅 (長さ col+1 の array) (指定ない場合は全て 1 になる)
  bgr: 各行の背景色 (長さ row+1 の array．各要素の例：'#DDDDFF' (青色になる) null (描画されない)) (指定ない場合は描画されない)
  */
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
    if (typeof hlw !== 'undefined') lw = hlw[i % hlw.length];
    const divStyle = {
      width,
      height: lw,
      backgroundColor: 'black',
      position: 'absolute',
      top: i * uh,
      left: 0,
    };
    elementList.push(<div key={elementList.length} style={divStyle} />);
  }
  for (let j = 0; j <= cols; j += 1) { // vertical lines
    let lw = 1;
    if (typeof vlw !== 'undefined') lw = vlw[j % vlw.length];
    const divStyle = {
      width: lw,
      height,
      backgroundColor: 'black',
      position: 'absolute',
      top: 0,
      left: j * uw,
    };
    elementList.push(<div key={elementList.length} style={divStyle} />);
  }
  return (<div>{elementList}</div>);
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
