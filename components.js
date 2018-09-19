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

class PianoRollGrid extends React.Component{ //グリッドエリア + yラベル
  /*
    pitchRange: [最小ノートナンバー, 最大ノートナンバー]
  */
  constructor(props){
    super(props);
    this.state = {
      uw: 50,
      uh: 18,
      pitchRange: props.pitchRange, //[minPitch, maxPitch]
      rows: props.pitchRange[1] - props.pitchRange[0] + 1,
      cols: 16,
      elementId: 'mainPianoRoll',
      xMargin: 36,
      selectRange: null, // [startBeat (decimal), minPitch (integer), endBeat (decimal), maxPitch (integer)]
      notes: {idCnt:0,
              add:function(x){this[this.idCnt]=x;this.idCnt++;return this.idCnt-1;},
              del:function(k){delete this[k];},
              clear:function(){for(let k in this){if (['idCnt', 'add', 'del', 'items', 'clear'].indexOf(k)===-1) delete this[k];}},
              items:function(){var ret={};for(let k in this){if (['idCnt', 'add', 'del', 'items', 'clear'].indexOf(k)===-1) ret[k]=this[k];} return ret;}
            } // {idCnt:0, add:f, del:f, clear:f, items:f, (dictKey):{pitch:64, start:0, end:3}, ...} // 現在のノート配置
    };
    //外からのアクセス用
    this.props.scoreData.notes = this.state.notes; //ノーツの一覧
    this.props.scoreData.clearNotes = this.clearNotes.bind(this); //ノーツの全削除
  }
  render(){
    var elementList = [];

    var pitchRange = this.state.pitchRange;
    var rows = this.state.rows;
    var cols = this.state.cols; 
    var uw = this.state.uw;
    var uh = this.state.uh;
    var xMargin = this.state.xMargin; //グリッドの左側のアキ

    //grid
    var isBlackKey = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    var bgr = [];
    for(let i=0;i<rows;i++){
      var pitch = pitchRange[1] - i;
      bgr.push(isBlackKey[pitch%12] ? '#EEEEFF' : '#FFFFFF');
    }
    var hlw = [...Array(rows+1).keys()].map(i => 1 + (((pitchRange[1]+1-i)%12) ? 0 : 1));
    var vlw = [...Array(cols+1).keys()].map(i => 1 + ((i%4) ? 0 : 1));
    elementList.push(<div key={elementList.length} style={{position:'absolute', left:xMargin}}><SimpleGrid rows={rows}
      cols={cols} uw={uw} uh={uh} hlw={hlw} vlw={vlw} bgr={bgr}/></div>);

    //yLabel (i.e. pitch name) 
    var pitchName = ['C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B'];
    for(let i=0;i<rows;i++){
      var pitch = pitchRange[1] - i;
      var label = pitchName[pitch%12];
      if (label === 'C') label += (pitch/12-1);
      elementList.push(
        <div key={elementList.length} style={{position:'absolute', left:0, top:uh*i}} draggable={false}>{label}</div>
      );
    }

    //notes (Component にすべき)
    for (let dictKey in this.state.notes.items()){
      var note = this.state.notes[dictKey];
      var leftBottom = this.timePitchToRelPos([note.start, note.pitch-0.5]);
      var rightTop = this.timePitchToRelPos([note.end, note.pitch+0.5]);
      /*
      var divStyle = {width:rightTop[0] - leftBottom[0], height:leftBottom[1] - rightTop[1], backgroundColor: 'red',
        borderRadius: 10, position:'absolute', top:rightTop[1], left:this.state.xMargin + leftBottom[0]};
      elementList.push(
        <div key={elementList.length} style={divStyle}></div>
      );
      */
      var divStyle = {position:'absolute', top:rightTop[1], left:this.state.xMargin + leftBottom[0]};
      elementList.push(
        <div key={elementList.length} style={divStyle}>
          <NoteBlock start={note.start} end={note.end} pitch={note.pitch} parent={this} dictKey={dictKey}/>
        </div>
      );        
    }

    //selection
    if (this.state.selectRange !== null){
      // [startBeat (decimal), minPitch (integer), endBeat (decimal), maxPitch (integer)]
      var leftBottom = this.timePitchToRelPos([this.state.selectRange[0], this.state.selectRange[1]-0.5]);
      var rightTop = this.timePitchToRelPos([this.state.selectRange[2], this.state.selectRange[3]+0.5]);
      var divStyle = {width:rightTop[0] - leftBottom[0], height:leftBottom[1] - rightTop[1], border: '1px dashed #f00',
        borderRadius: 10, position:'absolute', top:rightTop[1], left:this.state.xMargin + leftBottom[0]};
      elementList.push(
        <div key={elementList.length} style={divStyle}></div>
      );
    }

    return(<div id={this.state.elementId}
            onWheel={this.wheel.bind(this)} onMouseDown={this.mouseDown.bind(this)}
            onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)}>{elementList}</div>)
  }

  wheel(event){
    if (event.deltaY < 0 && this.state.pitchRange[1] < 127){
      this.setState({pitch: [this.state.pitchRange[0]+1, this.state.pitchRange[1]+1]});
    }else if (event.deltaY > 0 && this.state.pitchRange[0] > 0){
      this.setState({pitch: [this.state.pitchRange[0]-1, this.state.pitchRange[1]-1]});        
    }
  }
  mouseDown(event){
    // 要素の位置を取得
    var clientRect = document.getElementById(this.state.elementId).getBoundingClientRect();
    var originPos = [clientRect.left + window.pageXOffset + this.state.xMargin, clientRect.top + window.pageYOffset];
    var relPos = [event.pageX - originPos[0], event.pageY - originPos[1]];      
    this.setState({
      dragInfo: {originPos: originPos, startRelPos: relPos},
      currentRelPos: relPos,
      selectRange: this.calculateSelectRangeByTwoRelPos(relPos, relPos)
    });
  }
  mouseMove(event){
    if (this.state.dragInfo !== undefined){
      var currentRelPos = [event.pageX - this.state.dragInfo.originPos[0], event.pageY - this.state.dragInfo.originPos[1]];
      this.setState({
        currentRelPos: currentRelPos,
        selectRange: this.calculateSelectRangeByTwoRelPos(this.state.dragInfo.startRelPos, currentRelPos)
      });
    }
  }
  mouseUp(event){
    //ノーツを発生させる
    if (this.state.selectRange !== null){
      if (this.state.selectRange[0] < this.state.selectRange[2]){ //長さゼロ区間の場合を除く
        var note = {
          start: this.state.selectRange[0],
          end: this.state.selectRange[2],
          pitch: this.state.selectRange[1]
        }
        this.state.notes.add(note); // setState外の state書き換え（違反） 次行でsetStateしてるから良い？（ダメ）
        this.setState({dragInfo: undefined, selectRange: null});
      }
    }
  }


  relPosToTimePitch(relPos){ //relPos: グリッド左上からの座標ずれ
    return [relPos[0]/this.state.uw, this.state.pitchRange[1] + 0.5 - relPos[1]/this.state.uh];
  }
  timePitchToRelPos(timePitch){ //timePitch: 時刻とピッチ
    return [timePitch[0] * this.state.uw, (this.state.pitchRange[1] + 0.5 - timePitch[1]) * this.state.uh];
  }
  calculateSelectRangeByTwoRelPos(relPos1, relPos2, onePitch=true){
    var tp1 = this.relPosToTimePitch(relPos1);
    var tp2 = this.relPosToTimePitch(relPos2);
    var range;
    if (onePitch){
      range = [
        Math.max(0, Math.floor(Math.min(tp1[0], tp2[0]))),
        Math.max(0, Math.round(tp1[1])),
        Math.min(this.state.cols, Math.ceil(Math.max(tp1[0], tp2[0]))),
        Math.min(127, Math.round(tp1[1]))
      ];        
    }else{
      range = [
        Math.max(0, Math.floor(Math.min(tp1[0], tp2[0]))),
        Math.max(0, Math.round(Math.min(tp1[1], tp2[1]))),
        Math.min(this.state.cols, Math.ceil(Math.max(tp1[0], tp2[0]))),
        Math.min(127, Math.round(Math.max(tp1[1], tp2[1])))
      ];
    }
    return range;
  }

  clearNotes(){
    this.state.notes.clear();
    this.setState({});
  }
}