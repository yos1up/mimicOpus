import React from "react";

/* script type="text/babel" */
class SimpleGrid extends React.Component{ //グリッドエリア内のみ．
  /*
  rows: 行数 (number)
  cols: 列数 (number)
  uw: 1列の幅 (number)
  uh: 1行の幅 (number)
  hlw: 水平線の幅 (長さ row+1 の array) (指定ない場合は全て 1 になる)
  vlw: 垂直線の幅 (長さ col+1 の array) (指定ない場合は全て 1 になる)
  bgr: 各行の背景色 (長さ row+1 の array．各要素の例：'#DDDDFF' (青色になる) null (描画されない)) (指定ない場合は描画されない)
  */
  constructor(props){super(props);}
  render(){
    var elementList = [];
    var width = this.props.uw * this.props.cols;
    var height = this.props.uh * this.props.rows;

    //horizontal background color
    if (typeof this.props.bgr !== 'undefined'){
      for(let i=0;i<this.props.rows;i++){
        var bgColor = this.props.bgr[i % this.props.bgr.length];
        if (bgColor !== null){
          var divStyle = {width:width, height:this.props.uh, backgroundColor:bgColor, position:'absolute', top:i*this.props.uh, left:0};
          elementList.push(
            <div key={elementList.length} style={divStyle}></div>
          );
        }
      }
    }
    for(let i=0;i<=this.props.rows;i++){ //horizontal lines
      var lw = 1;
      if (typeof this.props.hlw !== 'undefined') lw = this.props.hlw[i % this.props.hlw.length];
      var divStyle = {width:width, height:lw, backgroundColor:'black', position:'absolute', top:i*this.props.uh, left:0};
      elementList.push(<div key={elementList.length} style={divStyle}></div>);
    }
    for(let j=0;j<=this.props.cols;j++){ //vertical lines
      var lw = 1;
      if (typeof this.props.vlw !== 'undefined') lw = this.props.vlw[j % this.props.vlw.length];
      var divStyle = {width:lw, height:height, backgroundColor:'black', position:'absolute', top:0, left:j*this.props.uw};
      elementList.push(<div key={elementList.length} style={divStyle}></div>);
    }
    return(<div>{elementList}</div>)
  }
}

export default SimpleGrid;
