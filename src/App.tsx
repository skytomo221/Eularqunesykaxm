import * as React from 'react';
import './App.css';
import { letters, rates, examples, Example, Letter } from './data';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { AppBar, Toolbar, IconButton, Typography, List } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

interface Props {
  value?: any;
  left?: string;
  right?: string;
  onClick?: any;
}

interface State { }

class Square extends React.Component<Props> {
  render() {
    if (this.props.value === null) {
      return (<button className="square-null" onClick={this.props.onClick} />);
    } else if (typeof this.props.value === "string") {
      return (<button className="square">{this.props.value}</button>);
    } else if (this.props.value <= 0.1) {
      return (<button className="square-low" onClick={this.props.onClick}>×</button>);
    } else if (this.props.value < 0.4) {
      return (<button className="square-low" onClick={this.props.onClick} />);
    } else if (this.props.value <= 0.6) {
      return (<button className="square-normal" onClick={this.props.onClick} />);
    } else if (this.props.value < 0.9) {
      return (<button className="square-high" onClick={this.props.onClick} />);
    } else if (this.props.value <= 1.0) {
      return (<button className="square-high" onClick={this.props.onClick}>○</button>);
    } else {
      return (<button className="square">{this.props.value}</button>);
    }
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

function App() {
  const classes = useStyles();

  const [open, setDialogOpen] = React.useState(false);
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");
  const [info, setInfo] = React.useState(<span />);
  const [examplesState, setExapmlesState] = React.useState(examples['i+i']);
  const [fullDialogOpen, setFullDialogOpen] = React.useState(false);

  const handleDialogClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFullDialogClickOpen = () => {
    setFullDialogOpen(true);
  };

  const handleFullDialogClose = () => {
    setFullDialogOpen(false);
  };

  const renderSquare = (i: any) => {
    return <Square value={i} />;
  };

  const renderToolTipSquare = (i: number | null, left: Letter, right: Letter, handleClickOpen: any) => {
    return <Square value={i} onClick={handleClickOpen} />;
  };

  const renderExamples = (list: Example[]) => {
    return (
      <List>
        {list.map((example) => {
          return (
            <ListItem button>
              <ListItemText primary={example.word} secondary={example.parts.join(' ')} />
            </ListItem>
          );
        })}
      </List>
    );
  }

  const getInfo = (value: (number | null)) => {
    if (value === null) {
      return (<span>資料不足です。</span>);
    } else {
      let rate = "コーパスの情報によると、この組み合わせの緩衝音の出現率は" + Math.round(value * 100).toString() + "%です。"
      if (value <= 0.1) {
        return (<span>{rate}<br />よって、緩衝音は<b>{"付けないべき"}</b>です。</span>);
      } else if (value < 0.4) {
        return (<span>{rate}<br />よって、緩衝音は<b>{"付けないほうがいい"}</b>です。</span>);
      } else if (value <= 0.6) {
        return (<span>{rate}<br />よって、緩衝音は<b>{"付けても付けなくてもいい"}</b>です。</span>);
      } else if (value < 0.9) {
        return (<span>{rate}<br />よって、緩衝音は<b>{"付けたほうがいい"}</b>です。</span>);
      } else if (value <= 1.0) {
        return (<span>{rate}<br />よって、緩衝音は<b>{"付けるべき"}</b>です。</span>);
      } else {
        return (<span>資料不足です。</span>);
      }
    }
  }

  return (
    <div>
      <div style={{ padding: '0 0 1em 0' }}>
        コーパスから得た情報を基に表を構成しています。<br />
        出現率は（緩衝音が登場したパターン+1）/（全てのパターン+2）で計算を行っています。
      </div>
      <div>
        <div className="board-row">
          {renderSquare(" ")}
          {letters.map((letter) => { return renderSquare(letter) })}
        </div>
        {letters.map((left, leftIndex) => {
          return (
            <div className="board-row">
              {renderSquare(left)}
              {letters.map((right, rightIndex) => {
                return (renderToolTipSquare(rates[left + '+' + right], left, right, () => {
                  handleDialogClickOpen();
                  setLeft(left);
                  setRight(right);
                  setInfo(getInfo(rates[left + '+' + right]));
                  setExapmlesState((examples[left + '+' + right] === undefined) ? (new Array<Example>(0)) : examples[left + '+' + right]);
                }));
              })}
            </div>
          );
        })}
      </div>
      <div className='paragraph'>
        <TableContainer component={Paper} style={{ width: 'min(100%, 400px)' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>凡例</TableCell>
                <TableCell>種類</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.9, 't', 'n', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けるべき</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.7, 'o', 'a', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けたほうがいい</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.5, 'i', 'y', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けても付けなくてもいい</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.3, 'i', 'u', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けないほうがいい</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.1, 'i', 'i', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けないべき</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br />
      <div className='paragraph'>
        <h2>緩衝音について</h2>
        <div>緩衝音とは、単語に接辞が付くときに、子音か母音が連続してしまい発音しづらくなるときに挟まれる音です。</div>
        <div>緩衝音には種類があり、単語のクラスによって入れるべき緩衝音が違います。リパライン語の単語クラスは、4つ存在しており、それらは一番最後の母音によって明確に区別されます。</div>
        <div className='paragraph'>
          <TableContainer component={Paper} style={{ width: 'min(100%, 600px)' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">最後の母音</TableCell>
                  <TableCell align="center">クラス</TableCell>
                  <TableCell align="center">緩衝母音</TableCell>
                  <TableCell align="center">緩衝子音</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={"row.name"}>
                  <TableCell align="center">a(r), o(r)</TableCell>
                  <TableCell align="center">紅クラス（クラス1）</TableCell>
                  <TableCell align="center">-a-</TableCell>
                  <TableCell align="center">-v-</TableCell>
                </TableRow>
                <TableRow key={"row.name"}>
                  <TableCell align="center">e(r), i(r)</TableCell>
                  <TableCell align="center">蒼クラス（クラス2）</TableCell>
                  <TableCell align="center">-e-</TableCell>
                  <TableCell align="center">-rg-</TableCell>
                </TableRow>
                <TableRow key={"row.name"}>
                  <TableCell align="center">o(r)</TableCell>
                  <TableCell align="center">烏クラス（クラス3）</TableCell>
                  <TableCell align="center">-u-</TableCell>
                  <TableCell align="center">-m-</TableCell>
                </TableRow>
                <TableRow key={"row.name"}>
                  <TableCell align="center">y(r)</TableCell>
                  <TableCell align="center">葵クラス（クラス4）</TableCell>
                  <TableCell align="center">-i-</TableCell>
                  <TableCell align="center">-l-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className='paragraph' />
      <div className='paragraph'>
        <Button onClick={() => { window.open('https://skytomo221.github.io/') }}>作者のページを見る</Button>
        <Button onClick={() => { window.open('https://github.com/skytomo221/eularqunesykaxm') }}>リポジトリ</Button>
      </div>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{left + " + " + right}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {info}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleDialogClose(); handleFullDialogClickOpen(); }} autoFocus>
            詳細
          </Button>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={fullDialogOpen}
        onClose={handleFullDialogClose}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton autoFocus edge="start" color="inherit" onClick={handleFullDialogClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            &ensp;
            <Typography variant="h6">
              {"【" + left + " + " + right + "】 詳細情報"}
            </Typography>
          </Toolbar>
        </AppBar>
        {renderExamples(examplesState)}
      </Dialog>
    </div>
  );
}

export default App;
