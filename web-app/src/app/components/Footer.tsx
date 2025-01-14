import React from 'react';
import '../styles/Footer.css';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Button, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { GitHub, LinkedIn, OpenInNew } from '@mui/icons-material';
import { MOBILITY_DATA_LINKS } from '../constants/Navigation';

const Footer: React.FC = () => {
  const navigateTo = (link: string): void => {
    window.open(link, '_blank');
  };

  return (
    <footer className='footer'>
      <a
        href={'https://share.mobilitydata.org/mobility-database-feedback'}
        target={'_blank'}
        rel='noreferrer'
        className={'btn-link'}
      >
        <Button
          sx={{ textTransform: 'none', mb: 2 }}
          variant={'outlined'}
          endIcon={<OpenInNew />}
        >
          Help Us by Sharing Feedback
        </Button>
      </a>
      <div style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
        <IconButton
          className='link-button'
          color='primary'
          onClick={() => {
            navigateTo(MOBILITY_DATA_LINKS.twitter);
          }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          className='link-button'
          color='primary'
          onClick={() => {
            navigateTo(MOBILITY_DATA_LINKS.slack);
          }}
        >
          <FontAwesomeIcon icon={faSlack} />
        </IconButton>
        <IconButton
          className='link-button'
          color='primary'
          onClick={() => {
            navigateTo(MOBILITY_DATA_LINKS.linkedin);
          }}
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          className='link-button'
          color='primary'
          onClick={() => {
            navigateTo(MOBILITY_DATA_LINKS.github);
          }}
        >
          <GitHub />
        </IconButton>
      </div>
      <p style={{ margin: 0 }}>Maintained with &#128156; by MobilityData.</p>
      <p style={{ margin: 0 }}>
        <a
          href={'https://mobilitydata.org/privacy-policy/'}
          target={'_blank'}
          rel={'noreferrer'}
        >
          Privacy Policy
        </a>
      </p>
      <p style={{ margin: 0 }}>
        <a href={'/terms-and-conditions'} target={'_blank'} rel={'noreferrer'}>
          Terms and Conditions
        </a>
      </p>
    </footer>
  );
};

export default Footer;
