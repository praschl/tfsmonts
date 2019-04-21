import {
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import './ErrorDisplay.css';

function ErrorDisplay(props: { message: string; closeClick(): void }) {
  return (
    <div className='error-message'>
      <span>{props.message}</span>
      <button onClick={props.closeClick}><FontAwesomeIcon icon={faTimes} /></button>
    </div>
  );
}

export default ErrorDisplay;
