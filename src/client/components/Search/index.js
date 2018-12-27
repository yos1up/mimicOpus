import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router';

import displayModes from '../../data/displayModes';
import filterLevels from '../../data/filterLevels';
import SearchQuery from '../../data/searchQuery';

import SoundPlayer from '../SoundPlayer';

class Search extends React.Component {
  constructor(props) {
    super(props);
    const searchQuery = new SearchQuery();
    this.state = {
      page: 0,
      searchQuery,
      tempSearchQuery: searchQuery,
    };
    this.soundPlayer = new SoundPlayer();
  }

  componentDidMount() {
    const {
      loadQuestionsList, loadCountQuestions, changeDisplayMode,
    } = this.props;
    const {
      page, searchQuery,
    } = this.state;
    loadCountQuestions(searchQuery);
    loadQuestionsList(searchQuery, 10 * page + 1, 10 * (page + 1));
    changeDisplayMode(displayModes.SEARCH);
  }

  render() {
    // TODO: history validation
    const {
      questionsList, setQuestion, setBPM,
      loadQuestionsList, setQuestionId, setNotes, setTitle, deleteUploadedQuestion, uid,
      countQuestions, loadCountQuestions, history,
    } = this.props;
    const {
      page, searchQuery, tempSearchQuery,
    } = this.state;
    return (
      <div id="Search">
        <Helmet>
          <meta charSet="utf-8" />
          <title>検索 - mimicOpus</title>
        </Helmet>
        <Paper
          style={{
            position: 'absolute', top: 10, left: 0, width: 1000, height: 100,
          }}
        >
          <div
            id="search title input"
            style={{
              position: 'absolute', top: 20, left: 10,
            }}
          >
            <Typography
              style={{
                position: 'absolute', top: 0, left: 0, width: 150,
              }}
            >
              タイトル
            </Typography>
            <Input
              value={tempSearchQuery.title}
              inputProps={{
                'aria-label': 'Description',
              }}
              style={{
                position: 'absolute', top: 20, left: 0, width: 150,
              }}
              onChange={(e) => {
                this.setState({
                  tempSearchQuery: tempSearchQuery.set('title', e.target.value),
                });
              }}
            />
          </div>
          <div
            id="bpm picker"
            style={{
              position: 'absolute', top: 20, left: 180,
            }}
          >
            <Typography
              style={{
                position: 'absolute', top: 0, left: 0, width: 120,
              }}
            >
              BPM
            </Typography>
            <FormControl
              style={{
                position: 'absolute', top: 20, left: 0, width: 60,
              }}
            >
              <Select
                value={tempSearchQuery.lowBPM}
                onChange={(e) => {
                  this.setState({
                    tempSearchQuery: tempSearchQuery.set('lowBPM', e.target.value),
                  });
                }}
                displayEmpty
              >
                <MenuItem value={60}>60</MenuItem>
                <MenuItem value={90}>90</MenuItem>
                <MenuItem value={120}>120</MenuItem>
                <MenuItem value={150}>150</MenuItem>
                <MenuItem value={180}>180</MenuItem>
              </Select>
            </FormControl>
            <Typography
              style={{
                position: 'absolute', top: 30, left: 60, width: 20,
              }}
            >
              ~
            </Typography>
            <FormControl
              style={{
                position: 'absolute', top: 20, left: 80, width: 60,
              }}
            >
              <Select
                value={tempSearchQuery.highBPM}
                onChange={(e) => {
                  this.setState({
                    tempSearchQuery: tempSearchQuery.set('highBPM', e.target.value),
                  });
                }}
                displayEmpty
              >
                <MenuItem value={200}>200</MenuItem>
                <MenuItem value={180}>180</MenuItem>
                <MenuItem value={150}>150</MenuItem>
                <MenuItem value={120}>120</MenuItem>
                <MenuItem value={90}>90</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div
            id="search title user"
            style={{
              position: 'absolute', top: 20, left: 330,
            }}
          >
            <Typography
              style={{
                position: 'absolute', top: 0, left: 0, width: 150,
              }}
            >
              作成者
            </Typography>
            <Input
              value={tempSearchQuery.user}
              inputProps={{
                'aria-label': 'Description',
              }}
              style={{
                position: 'absolute', top: 20, left: 0, width: 150,
              }}
              onChange={(e) => {
                this.setState({
                  tempSearchQuery: tempSearchQuery.set('user', e.target.value),
                });
              }}
            />
          </div>
          <div
            id="level filter"
            style={{
              position: 'absolute', top: 20, left: 490,
            }}
          >
            <Typography
              style={{
                position: 'absolute', top: 0, left: 0, width: 150,
              }}
            >
              難易度
            </Typography>
            <FormControl
              style={{
                position: 'absolute', top: 20, left: 0, width: 150,
              }}
            >
              <Select
                value={tempSearchQuery.level}
                onChange={(e) => {
                  this.setState({
                    tempSearchQuery: tempSearchQuery.set('level', e.target.value),
                  });
                }}
                displayEmpty
              >
                <MenuItem value={filterLevels.TO_TWO_HND}>~200</MenuItem>
                <MenuItem value={filterLevels.TWO_HND_TO_FOUR_HND}>200~400</MenuItem>
                <MenuItem value={filterLevels.FOUR_HND_TO_SIX_HND}>400~600</MenuItem>
                <MenuItem value={filterLevels.SIX_HND_TO_EIGHT_HND}>600~800</MenuItem>
                <MenuItem value={filterLevels.EIGHT_HND_TO_ONE_K}>800~1000</MenuItem>
                <MenuItem value={filterLevels.FROM_ONE_K}>1000~</MenuItem>
                <MenuItem value={filterLevels.ALL}>すべての難易度</MenuItem>
              </Select>
            </FormControl>
          </div>
          <FormGroup
            style={{
              position: 'absolute', top: 5, left: 680, height: 180,
            }}
          >
            <FormControlLabel
              disabled={uid === -1}
              control={(
                <Checkbox
                  checked={tempSearchQuery.madeByMe}
                  onChange={(e) => {
                    this.setState({
                      tempSearchQuery: tempSearchQuery.set('madeByMe', e.target.checked),
                    });
                  }}
                  value="checkedA"
                />
              )}
              style={{
                height: 30,
              }}
              label="自分が作成"
            />
            <FormControlLabel
              disabled={uid === -1}
              control={(
                <Checkbox
                  checked={tempSearchQuery.answered}
                  onChange={(e) => {
                    this.setState({
                      tempSearchQuery: tempSearchQuery.set('answered', e.target.checked),
                    });
                  }}
                  value="checkedB"
                />
              )}
              style={{
                height: 30,
              }}
              label="回答済み"
            />
            <FormControlLabel
              disabled={uid === -1}
              control={(
                <Checkbox
                  checked={tempSearchQuery.unanswered}
                  onChange={(e) => {
                    this.setState({
                      tempSearchQuery: tempSearchQuery.set('unanswered', e.target.checked),
                    });
                  }}
                  value="checkedB"
                />
              )}
              style={{
                height: 30,
              }}
              label="未回答"
            />
          </FormGroup>
          <FormGroup
            style={{
              position: 'absolute', top: 5, left: 800, height: 180,
            }}
          >
            <FormControlLabel
              disabled={uid === -1}
              control={(
                <Checkbox
                  checked={tempSearchQuery.completed}
                  onChange={(e) => {
                    this.setState({
                      tempSearchQuery: tempSearchQuery.set('completed', e.target.checked),
                    });
                  }}
                  value="checkedB"
                />
              )}
              style={{
                height: 30,
              }}
              label="満点の問題を表示"
            />
          </FormGroup>
          <Button
            variant="contained"
            color="primary"
            style={{
              position: 'absolute', top: 45, left: 820, width: 100,
            }}
            onClick={() => {
              loadCountQuestions(tempSearchQuery);
              loadQuestionsList(tempSearchQuery, 1, 10);
              this.setState({
                searchQuery: tempSearchQuery,
                page: 0,
              });
            }}
          >
            検索
          </Button>
        </Paper>
        {
          [...questionsList].map((item, i) => {
            const { id, question } = item;
            const date = `${question.uploadedAt.getFullYear()}/${question.uploadedAt.getMonth() + 1}/${question.uploadedAt.getDate()}`;
            const bMine = (uid === question.uid);
            console.log(question.score);
            let scoreColor = '#CCCCCC';
            if (question.score >= 100) {
              scoreColor = '#EA5455';
            } else if (question.score >= 80) {
              scoreColor = '#DE4313';
            } else if (question.score >= 60) {
              scoreColor = '#FFF886';
            } else if (question.score >= 40) {
              scoreColor = '#49C628';
            } else if (question.score >= 20) {
              scoreColor = '#58CFFB';
            } else if (question.score > 0) {
              scoreColor = '#97ABFF';
            }
            return (
              <Card
                style={{
                  position: 'absolute',
                  width: 1000,
                  left: 0,
                  height: 95,
                  top: 100 * i + 120,
                }}
                onClick={() => {
                  history.push(`/playquestion/${id}`);
                }}
              >
                <CardActionArea style={{ width: '100%', height: '100%' }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      color="textSecondary"
                      style={{
                        position: 'absolute', top: 30, left: 30, width: 900,
                      }}
                    >
                      {question.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      style={{
                        position: 'absolute', top: 60, left: 30, width: 900,
                      }}
                    >
                      {question.displayName}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      style={{
                        position: 'absolute', top: 10, left: 30, width: 900,
                      }}
                    >
                      {date}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{
                        position: 'absolute', top: 10, left: 400, width: 900,
                      }}
                    >
                      {`BPM ${question.bpm}`}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{
                        position: 'absolute', top: 35, left: 400, width: 900,
                      }}
                    >
                      {`▶︎ ${question.playedUserNum}`}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{
                        position: 'absolute', top: 60, left: 400, width: 900,
                      }}
                    >
                      {`難易度 ${parseFloat(question.rating).toFixed()}`}
                    </Typography>
                    {(!bMine) ? (
                      <div>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          style={{
                            position: 'absolute', top: 10, left: 700, width: 900,
                          }}
                        >
                          {'myscore'}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          style={{
                            position: 'absolute',
                            top: 30,
                            left: 700,
                            width: 900,
                            fontSize: 32,
                            color: scoreColor,
                          }}
                        >
                          {(question.score !== undefined && question.score !== null) ? parseFloat(question.score).toFixed(2) : '??.??'}
                        </Typography>
                      </div>
                    ) : null
                    }
                  </CardContent>
                </CardActionArea>
                <Tooltip title={`${question.title}を再生`}>
                  <IconButton
                    aria-label="Play"
                    onClick={(e) => {
                      this.soundPlayer.play(question.notes, question.bpm);
                      e.stopPropagation();
                    }}
                    style={{
                      position: 'absolute', top: 25, left: 600, width: 50, height: 50,
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>
                {(bMine) ? (
                  <Tooltip title={`${question.title}を編集して別名保存`}>
                    <IconButton
                      aria-label="Edit"
                      onClick={(e) => {
                        setNotes(question.notes);
                        setBPM(question.bpm);
                        setQuestionId(id);
                        setTitle(question.title);
                        history.push('/makequestion');
                        e.stopPropagation();
                      }}
                      style={{
                        position: 'absolute', top: 25, left: 670, width: 50, height: 50,
                      }}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
                }
                {(bMine) ? (
                  <Tooltip title={`${question.title}を削除`}>
                    <IconButton
                      aria-label="Delete"
                      onClick={(e) => {
                        deleteUploadedQuestion(id, () => {
                          loadCountQuestions(tempSearchQuery);
                          loadQuestionsList(tempSearchQuery, 1, 10);
                        });
                        e.stopPropagation();
                      }}
                      style={{
                        position: 'absolute', top: 25, left: 740, width: 50, height: 50,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
                }
              </Card>
            );
          })
        }
        <Table
          style={{
            position: 'absolute',
            top: questionsList.size * 100 + 120,
            left: 0,
            width: 1000,
          }}
        >
          <TableFooter>
            <TablePagination
              colSpan={3}
              count={countQuestions}
              rowsPerPage={10}
              page={page}
              rowsPerPageOptions={[10]}
              onChangePage={(event, page_) => {
                this.setState({ page: page_ });
                loadQuestionsList(tempSearchQuery, 10 * page_ + 1, 10 * (page_ + 1));
              }}
            />
          </TableFooter>
        </Table>
      </div>
    );
  }
}

Search.propTypes = {
  questionsList: PropTypes.instanceOf(Immutable.List).isRequired,
  uid: PropTypes.number.isRequired,
  countQuestions: PropTypes.number.isRequired,
  setQuestion: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
  setBPM: PropTypes.func.isRequired,
  setNotes: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  loadQuestionsList: PropTypes.func.isRequired,
  setQuestionId: PropTypes.func.isRequired,
  deleteUploadedQuestion: PropTypes.func.isRequired,
  loadCountQuestions: PropTypes.func.isRequired,
};

export default withRouter(Search);
