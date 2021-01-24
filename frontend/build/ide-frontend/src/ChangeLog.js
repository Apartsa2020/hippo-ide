import { CardActions, CardContent, Container, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './ChangeLog.css';

import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

import { getRepoCommitArray } from './GitHub_api';

/* ------------------------------------
 * !!! ChangeLog followed GNU style !!!
 * ------------------------------------
 * Link: https://www.gnu.org/prep/standards/html_node/Style-of-Change-Logs.html#Style-of-Change-Logs
 * 
 * <Date>     <Contributor Name>    <Contributor Email>
 *          <Modification Description>
 *          ......
 *          ......
 */ 

/* ------------------------
 * !!! Global Variables !!!
 * ------------------------ */
const repoOwner = "Apartsa2020";
const repoName = "hippo-ide";
// const repoOwner = "jasonrudolph";
// const repoName = "keyboard";
const repoLink = "https://github.com/Apartsa2020/hippo-ide";


export default function ChangeLog() {
    return (
        <div className="change-log-block">
            <Paper variant="outlined" p={1} className="change-log-paper">
                <Typography variant="h5">
                    {"ChangeLog (Follow GNU Style)"}
                </Typography>

                <Log />
            </Paper>
        </div>
    );
};


export function LogInfo(contributor, date, email, modification, html_url) {
    let obj = {
        contributor: contributor,
        date: date,
        email: email,
        modification: modification,
        html_url: html_url,
    };
    return obj;
}



// let test1 = new LogInfo("Paul Eggert", new Date(2019, 5, 15), "eggert@cs.ucla.edu", "Port to platforms where tputs is in libtinfo* configure.ac (tputs_library): Also try tinfow, ncursesw (Bug#33977).");


function Log(props) {
    const [commitArray, setCommitArray] = useState([]);

    useEffect(() => {
        getRepoCommitArray(repoOwner, repoName)
        .then(resp => {
            setCommitArray(resp);
            console.log(`commit array = ${commitArray} with type = ${typeof( commitArray )}`);
        })
        .catch(error => console.log(`failed with mesg = ${error.mesg}`));
    });

    return (
        <div className="log">
            {commitArray.map( ( item, index ) => {
                return (
                    <Card key={index} style={{marginTop: 30, marginBottom: 30, }} >
                        <CardContent>
                            <div className="log-metadata">
                                <span>
                                    {item.date}
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
    );
};


function dateToString(date) {
    // alert("typeof date = " + typeof(date));
    let year = String(date.getFullYear());
    let day = String(date.getDate());
    let month = String(date.getMonth() + 1);
    return (year + "-" + month + "-" + day);
}