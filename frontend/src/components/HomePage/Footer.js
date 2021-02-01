import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';



/* --------------
 * !!! Footer !!!
 * -------------- */
export default function Footer() {
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