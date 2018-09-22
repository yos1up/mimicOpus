import React from "react";


class NoteBlock extends React.Component { //ノーツ
  /*
    start: ノートオン時刻
    end: ノートオフ時刻
    pitch: ノートナンバー
    parent: 親 PianoRollGrid インスタンス．
  */
  constructor(props){super(props);}
  render(){
    var start = this.props.start;
    var end = this.props.end;
    var pitch = this.props.pitch;
    var pianoRollGrid = this.props.parent;
    var divStyle = {width:pianoRollGrid.state.uw * (end - start), height:pianoRollGrid.state.uh, backgroundColor: 'blue',
      borderRadius: 10, position:'absolute', top:0, left:0, opacity:0.5};
    return(
      <div style={divStyle} onMouseDown={this.click.bind(this)}></div>
    );
  }
  click(event){
    //クリックイベントの親オブジェクトへの伝播を止める
    event.stopPropagation();
    //親のノートリストから自身を削除する
    var pianoRollGrid = this.props.parent;
    pianoRollGrid.state.notes.del(this.props.dictKey);
    pianoRollGrid.setState({});
  }
}

export default NoteBlock;
