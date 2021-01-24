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
// import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { AvatarGroup } from '@material-ui/lab';
import "./SignIn.css";
import ApartsaLogo from './asset/Apartsa_logo.png';
import { Tooltip } from '@material-ui/core';
import ChangeLog from './ChangeLog';

import { getGitHubRepoStarNumber, getGitHubRepoContributors } from './GitHub_api';



/* ------------------------
 * !!! Global Variables !!!
 * ------------------------ */
const repoOwner = "Apartsa2020";
const repoName = "hippo-ide";
// const repoOwner = "jasonrudolph";
// const repoName = "keyboard";
const repoLink = "https://github.com/Apartsa2020/hippo-ide";



export default function IndexPage() {
  return (
    <div className="index-page">
        <Heading />
        <SignIn />
        <ChangeLog />
        <Footer />
    </div>
  );
};



function LastUpdateDate(props) {
  return (
    <span>
      <Tooltip title={"Last updated on " + dateToYearMonthDayString(new Date())}>
        <a href="/">
          <DateRangeTwoToneIcon style={{fontSize: "20px",}} /> 
          {dateToYearMonthDayString(new Date())}
        </a>
      </Tooltip>
    </span>
  );
}

function GitHubStarNumber(props) {
  const [ starNumber, setStarNumber ] = useState(0);

  useEffect(() => {
    getGitHubRepoStarNumber(props.repoOwner, props.repoName)
    .then(resp => {
      // console.log(`GitHubStarNumber functional component: fetch success with status code = ${resp}`);
      setStarNumber(resp);
      // console.log(`starNumber = ${starNumber}`);
      // console.log(`type of star number = ${typeof(starNumber)}`);
    })
    .catch(error => console.log(`GitHubStarNumber functional component: ${error.mesg}`));
  });

  return (
    <span>
      <a href="/">
        {starNumber}
        <StarRateIcon style={{fontSize: "18px",}} />
        {"GitHub"}
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
      console.log(`Contributor functional component: value is ${resp}`);
      setContributorArray(resp);
    })
    .catch(error => {
      console.log(`fetch repo contributor array: error ${error.mesg}`);
    })
  });

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
                <Avatar alt={name} src={githubAvatarAPI+name}></Avatar>
              </Tooltip>
            );
          })}
        </AvatarGroup>
        </div>
    </span>
  );
}  



function Heading(props) {

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

              <Typography style={{paddingTop: 10,}}>
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
            <Link className="footer-link" href="https://github.com/cdr/code-server" target="_blank" style={{paddingLeft: 10, paddingRight: 10,}}>
              {"Code-Server"}
            </Link>
            <Link className="footer-link" href="https://reactjs.org/" target="_blank" style={{paddingLeft: 10, paddingRight: 10,}}>
              {"React JS"}
            </Link>
            <Link className="footer-link" href="https://material-ui.com/" target="_blank" style={{paddingLeft: 10, paddingRight: 10,}}>
              {"Material UI"}
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}

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

export function SignIn() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Use Now
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











function dateToYearMonthDayString(date) {
  let day = String(date.getDate());
  switch(date.getDate() % 10) {
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
  switch(date.getMonth() + 1) {
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