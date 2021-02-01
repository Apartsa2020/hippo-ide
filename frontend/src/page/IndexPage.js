import React from 'react';
import Grid from '@material-ui/core/Grid';


import "../style/IndexPage.css";
import Heading from '../components/HomePage/Heading';
import SignIn from '../components/HomePage/SignIn';
import ChangeLog from '../components/HomePage/ChangeLog';
import Footer from '../components/HomePage/Footer';





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





/* Used in ChangeLog component as a data structure for log info */
export function LogInfo(contributor, date, email, modification, html_url) {
  this.contributor = contributor;
  this.date = date;
  this.email = email;
  this.modification = modification;
  this.html_url = html_url;
}