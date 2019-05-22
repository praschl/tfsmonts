import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import './FolderButton.css';

const doubleClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  // do not execute the double click of the table row
  event.stopPropagation();
};

const FolderButton = (props:{clickHandler:(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}) => {
  return (
    <button className='folderButton' onClick={props.clickHandler} onDoubleClick={doubleClickHandler}>
      <FontAwesomeIcon icon={faFolderOpen} />
    </button>
  );
};

export default FolderButton;
