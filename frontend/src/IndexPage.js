import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';



/* ------------------
 * !!! My Imports !!!
 * ------------------ */
import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';
import StarRateIcon from '@material-ui/icons/StarRate';
import { AvatarGroup } from '@material-ui/lab';
import ApartsaLogo from './asset/Apartsa_logo.png';
import { Tooltip } from '@material-ui/core';

import { CardActions, CardContent } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';


import "./IndexPage.css";
import { getGitHubRepoStarNumber, getGitHubRepoContributors, getRepoCommitArray, getRepoLastCommitDate } from './GitHub_api';



/* ------------------------
 * !!! Global Variables !!!
 * ------------------------ */
const repoOwner = "Apartsa2020";
const repoName = "hippo-ide";
// const repoOwner = "jasonrudolph";
// const repoName = "keyboard";
const repoLink = "https://github.com/Apartsa2020/hippo-ide";



/* ----------------------
 * !!! The whole page !!!
 * ---------------------- */
export default function IndexPage() {
  return (
    <div className="index-page">
      <Heading />
      <Grid container style={{maxHeight: '30%',}} >
        <Grid item  className="changelog-grid" >
          <ChangeLog />
        </Grid>
        <Grid item  className="signin-grid" >
          <SignIn />
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};




/* ---------------
 * !!! Heading !!!
 * --------------- */
function Heading(props) {

  function LastUpdateDate(props) {
    const [lastModifiedDate, setLastModifiedDate] = useState(new Date());

    useEffect(() => {
      getRepoLastCommitDate(repoOwner, repoName)
        .then(resp => {
          // console.log( `LastUpdateDate functional component: promise return value = ${resp} with type = ${ typeof(resp) }` );
          setLastModifiedDate(resp);
        });
    }, []);

    return (
      <span>
        <Tooltip title={"Last updated on " + dateToYearMonthDayString(lastModifiedDate)}>
          <a href="/">
            <DateRangeTwoToneIcon style={{ fontSize: "20px", }} />
            {dateToYearMonthDayString(lastModifiedDate)}
          </a>
        </Tooltip>
      </span>
    );
  }

  function GitHubStarNumber(props) {
    const [starNumber, setStarNumber] = useState(0);

    useEffect(() => {
      getGitHubRepoStarNumber(repoOwner, repoName)
        .then(resp => {
          // console.log(`GitHubStarNumber functional component: fetch success with status code = ${resp}`);
          setStarNumber(resp);
          // console.log(`starNumber = ${starNumber}`);
        })
        .catch(error => console.log(`GitHubStarNumber functional component: ${error.mesg}`));
    }, []);

    return (
      <span>
        <a href="/">
          {"GitHub"}
          <StarRateIcon style={{ fontSize: "18px", }} />
          {starNumber}
        </a>
      </span>
    );
  }

  function Contributor(props) {
    const [contributorArray, setContributorArray] = useState([]);

    const githubAvatarAPI = "https://avatars.githubusercontent.com/";

    useEffect(() => {
      getGitHubRepoContributors(repoOwner, repoName)
        .then(resp => {
          setContributorArray(resp);
        })
        .catch(error => {
          console.log(`fetch repo contributor array: error ${error.mesg}`);
        })
    }, []);

    return (
      <span>
        <div className="contributor">
          <a href={repoLink} target="_blank" rel="noreferrer">Contributors: </a>
        </div>
        <div className="contributor">
          <AvatarGroup max={4}>
            {contributorArray.map((name, index) => {
              return (
                <Tooltip title={name} key={index}>
                  <Avatar alt={name} src={githubAvatarAPI + name}></Avatar>
                </Tooltip>
              );
            })}
          </AvatarGroup>
        </div>
      </span>
    );
  }

  return (
    <div id="heading-block">
      <div className="logo">
        <a href="https://apartsa.com/">
          <img alt="Apartsa Logo" src={ApartsaLogo} />
        </a>
      </div>

      <div className="headline">
        <Typography component="h1" variant="h4">
          Apartsa Hippo IDE
              </Typography>
      </div>

      <div className="sub-title">
        <Typography>
          {"Warning: This is a beta version. All data will be cleared in 2021-01-19 23:30!"}
        </Typography>

        <Typography style={{ paddingTop: 10, }}>
          {"(The development is still on-going. You are welcomed to contribute codes through "}
          <Link className="heading-link" href="https://github.com/Apartsa2020/hippo-ide">GitHub</Link>
          {" or email to "}
          <Link className="heading-link" href="mailto://gx@apartsa.com" type="email">gx@apartsa.com</Link>
          {" !) "}
        </Typography>
      </div>

      <div className="info-box">
        <LastUpdateDate />
        <GitHubStarNumber repoOwner={repoOwner} repoName={repoName} />
        <Contributor />
      </div>
    </div>
  );
}





/* ---------------
 * !!! Sign In !!!
 * --------------- */
const useStyles = makeStyles((theme) => ({
  heading: {
    textAlign: 'center',
  },

  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs" style={{marginTop: '15%',}}>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Try It Now
        </Typography>
        <form method="POST" action={"/service/new"} className={classes.form} noValidate >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            type="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
        </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
            </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}





/* --------------------------------------
 * !!! ChangeLog (followed GNU style) !!!
 * --------------------------------------
 * Link: https://www.gnu.org/prep/standards/html_node/Style-of-Change-Logs.html#Style-of-Change-Logs
 * 
 * <Date>     <Contributor Name>    <Contributor Email>
 *          <Modification Description>
 *          ......
 *          ......
 */

function ChangeLog(props) {
  const [commitArray, setCommitArray] = useState([]);

  useEffect(() => {
    getRepoCommitArray(repoOwner, repoName)
      .then(resp => {
        setCommitArray(resp);
        // console.log(`commit array = ${JSON.stringify(commitArray)} with type = ${typeof( commitArray )}`);
      })
      .catch(error => console.log(`failed with mesg = ${error.mesg}`));
  }, []);


  return (
    <div className="change-log-block">
      <Paper variant="outlined" p={1} className="change-log-paper">
        <Typography variant="h5">
          {"ChangeLog (Follow GNU Style)"}
        </Typography>

        <div className="log-outer">
          <div className="log">
            {commitArray.map((item, index) => {
              return (
                <Card key={index} style={{ marginTop: 30, marginBottom: 30, }} >
                  <CardContent>
                    <div className="log-metadata">
                      <span>
                        {changeLogTimeStructure(new Date(item.date))}
                      </span>
                      <span>
                        {item.contributor}
                      </span>
                      <span>
                        {"<"}
                        {item.email}
                        {">"}
                      </span>
                    </div>
                    <div className="log-content">
                      <span>
                        {item.modification}
                      </span>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" href={item.html_url} target="_blank">
                      Learn More
                                </Button>
                  </CardActions>
                </Card>
              );
            })}
          </div>
        </div>
        
      </Paper>
    </div>
  );
};






/* --------------
 * !!! Footer !!!
 * -------------- */
function Footer() {
  return (
    <div className="footer">
      <hr />
      <div className="copyright">
        <Typography>
          {'Copyright © '}
          <Link className="footer-link" href="https://apartsa.com/" target="_blank">
            Apartsa Co.Ltd
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </div>

      <div className="footer-info">
        <div className="license">
          <Typography>
            {'License: '}
            <Link className="footer-link" href="https://github.com/Apartsa2020/hippo-ide/blob/main/LICENSE" target="_blank">
              MIT License
            </Link>
          </Typography>
        </div>
        <div className="acknowledge">
          <Typography>
            {"Acknowledgement: "}
            <Link className="footer-link" href="https://github.com/cdr/code-server" target="_blank" style={{ paddingLeft: 10, paddingRight: 10, }}>
              {"Code-Server"}
            </Link>
            <Link className="footer-link" href="https://reactjs.org/" target="_blank" style={{ paddingLeft: 10, paddingRight: 10, }}>
              {"React JS"}
            </Link>
            <Link className="footer-link" href="https://material-ui.com/" target="_blank" style={{ paddingLeft: 10, paddingRight: 10, }}>
              {"Material UI"}
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}










/* ----------------------
 * !!! Used Functions !!!
 * ---------------------- 
 * Not functional component 
 */


/* Used in ChangeLog component as a data structure for log info */
export function LogInfo(contributor, date, email, modification, html_url) {
  // let obj = {
  //     contributor: contributor,
  //     date: date,
  //     email: email,
  //     modification: modification,
  //     html_url: html_url,
  // };
  // return obj;

  this.contributor = contributor;
  this.date = date;
  this.email = email;
  this.modification = modification;
  this.html_url = html_url;
}


/* used in heading for date display */
function dateToYearMonthDayString(date) {
  let day = String(date.getDate());
  switch (date.getDate() % 10) {
    case 1:
      day += "st";
      break;
    case 2:
      day += "nd";
      break;
    case 3:
      day += "rd";
      break;
    default:
      day += "th";
      break;
  }

  let year = String(date.getFullYear());

  // Here, getMonth should plus 1 to get the correct output
  let month;
  switch (date.getMonth() + 1) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
    default:
      console.log(`Error in date to year/month/day string function: unidentified month number ${date.getMonth() + 1}`);
      break;
  }

  return (day + " " + month + " " + year);
}


function changeLogTimeStructure(date) {
  if (date instanceof Date === true) {
    // console.log(`date = ${date} with type = ${ typeof(date) }`);
    let year = String(date.getFullYear());
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());

    let time = date.toLocaleTimeString();

    return `${year}-${month}-${day}   ${time}`;
  }
  else {
    console.log("changeLog time structure function: input date is not of type Date");
    return null;
  }
}