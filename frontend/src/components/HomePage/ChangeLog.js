import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActions, CardContent } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import { getRepoCommitArray } from '../../api/GitHub_api';

import { repoOwner, repoName } from './Heading';


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

export default function ChangeLog(props) {
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