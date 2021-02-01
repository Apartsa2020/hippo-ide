import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';



import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';
import StarRateIcon from '@material-ui/icons/StarRate';
import { AvatarGroup } from '@material-ui/lab';
import ApartsaLogo from '../../asset/Apartsa_logo.png';
import { Tooltip } from '@material-ui/core';


import { getGitHubRepoStarNumber, getGitHubRepoContributors, getRepoLastCommitDate } from '../../api/GitHub_api';



export const repoOwner = "Apartsa2020";
export const repoName = "hippo-ide";
const repoLink = "https://github.com/Apartsa2020/hippo-ide";


/* ---------------
 * !!! Heading !!!
 * --------------- */
export default function Heading(props) {

  
    return (
      <div id="heading-block">
        {/* <div className="logo">
          <a href="https://apartsa.com/">
            <img alt="Apartsa Logo" src={ApartsaLogo} />
          </a>
        </div> */}
  
        <div className="headline">
          <Typography component="h1" variant="h4">
            Hippo IDE
                </Typography>
        </div>
  
        <div className="sub-title">
          <Typography>
            {"Warning: This is a beta version. All data will be cleared in 2021-01-30 23:00!"}
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

    // const githubAvatarAPI = "https://avatars.githubusercontent.com/";
    const githubAvatarAPI = "http://githubavatars.z3c.xyz/";

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