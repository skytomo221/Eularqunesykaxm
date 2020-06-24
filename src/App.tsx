import * as React from 'react';
import './App.css';
import { letters, rates } from './data';
import Button from '@material-ui/core/Button';
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

function App() {
  const [open, setOpen] = React.useState(false);
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");
  const [info, setInfo] = React.useState(<span />);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderSquare = (i: any) => {
    return <Square value={i} />;
  };

  const renderToolTipSquare = (i: number | null, left: string, right: string, handleClickOpen: any) => {
    return <Square value={i} onClick={handleClickOpen} />;
  };

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
      <div>
        コーパスから得た情報を基に表を構成しています。<br />
        出現率は（緩衝音が登場したパターン+1）/（全てのパターン+2）で計算を行っています。
      </div>
      <br />
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
                  handleClickOpen();
                  setLeft(left);
                  setRight(right);
                  setInfo(getInfo(rates[left + '+' + right]));
                }));
              })}
            </div>
          );
        })}
      </div>
      <br />
      <div>
        <TableContainer component={Paper} style={{ width: 'min(100%, 400px)' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>マーク</TableCell>
                <TableCell>種類</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.9, '', '', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けるべき</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.7, '', '', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けたほうがいい</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.5, '', '', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けても付けなくてもいい</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.3, '', '', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けないほうがいい</TableCell>
              </TableRow>
              <TableRow key={"row.name"}>
                <TableCell component="th" scope="row">
                  {renderToolTipSquare(0.1, '', '', () => { })}
                </TableCell>
                <TableCell>緩衝音を付けないべき</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
