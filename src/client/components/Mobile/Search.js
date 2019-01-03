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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
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
        <List component="nav">
          <Divider />
          {
            [...questionsList].map((item, i) => {
              const { id, question } = item;
              const date = `${question.uploadedAt.getFullYear()}/${question.uploadedAt.getMonth() + 1}/${question.uploadedAt.getDate()}`;
              const bMine = (uid === question.uid);
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
                <div>
                  <ListItem
                    button={!bMine}
                    onClick={bMine ? (
                      () => {}
                    ) : (
                      () => {
                        history.push(`/playquestion/${id}`);
                      }
                    )}
                    style={{
                      height: 90,
                    }}
                  >
                    <div>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          top: 10,
                          color: '#999999',
                        }}
                      >
                        {question.displayName}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          left: 100,
                          top: 10,
                          color: '#999999',
                        }}
                      >
                        {`${date}`}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        style={{
                          position: 'absolute',
                          fontWeight: 'bold',
                          top: 30,
                        }}
                      >
                        {question.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          top: 60,
                        }}
                      >
                        {`BPM ${question.bpm}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          top: 60,
                          left: 90,
                        }}
                      >
                        {`▶︎ ${question.playedUserNum}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          top: 60,
                          left: 130,
                        }}
                      >
                        {`難易度 ${parseFloat(question.rating).toFixed()}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 230,
                          color: '#999999',
                        }}
                      >
                        My Score
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        style={{
                          position: 'absolute',
                          top: 5,
                          left: 300,
                          color: scoreColor,
                          fontWeight: 'bold',
                          fontSize: 20,
                        }}
                      >
                        {(question.score !== undefined && question.score !== null) ? parseFloat(question.score).toFixed(2) : '??.??'}
                      </Typography>
                      <IconButton
                        aria-label="Play"
                        onClick={(e) => {
                          this.soundPlayer.play(question.notes, question.bpm);
                          e.stopPropagation();
                        }}
                        style={{
                          position: 'absolute', top: 40, left: 220, width: 50, height: 50,
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                      {(bMine) ? (
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
                            position: 'absolute', top: 40, left: 275, width: 50, height: 50,
                          }}
                        >
                          <FileCopyIcon />
                        </IconButton>
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
                              position: 'absolute', top: 40, left: 330, width: 50, height: 50,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null
                      }
                    </div>
                  </ListItem>
                  <Divider />
                </div>
              );
            })
          }
          <Table>
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
        </List>
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
