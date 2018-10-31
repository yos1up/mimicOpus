import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';


function FAQ({ open, closeFAQDialog }) {
  return (
    <Dialog open={open} onClose={() => closeFAQDialog()}>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          音符の入力方法
        </Typography>
        <Typography variant="body1" gutterBottom>
          ピアノロール上でドラッグ&ドロップすると、音符を入力できます。
          <br />
          入力した音符は、クリックすると消すことができます。
          <br />
          上下矢印キー（またはマウスホイール）で、ピアノロールの音域を上下に移動できます。
        </Typography>
        <br />
        <Typography variant="h6" gutterBottom>
          採点基準
        </Typography>
        <Typography variant="body1" gutterBottom>
          提出された譜面の各音符の「音高」と「音の始まりのタイミング」を
          用いて採点を行っています（現状「音の終わりのタイミング」は採点していません）。
          <br />
          全ての音符を過不足なく耳コピできている場合に限り、満点の 100 点となります。
        </Typography>
        <br />
        <Typography variant="h6" gutterBottom>
          レーティング
        </Typography>
        <Typography variant="body1" gutterBottom>
          レーティングは、その人の「耳コピ力」を表す目安となる数値で、
          問題を解くことによって変動します。
          難しい問題で高いハイスコアを取るほど、大きな値となります。
          <br />
          各ユーザーのレーティングと各問題の難易度は、項目反応理論 (IRT) と呼ばれる手法により
          同時に推定しています。そのため、他の人が問題を解くことによっても、自分のレーティングは変動します。
          <br />
          現状、各ユーザーのレーティングと各問題の難易度は約 10 分に一度更新されます。
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

FAQ.propTypes = {
  open: PropTypes.bool.isRequired,
  closeFAQDialog: PropTypes.func.isRequired,
};

export default FAQ;
