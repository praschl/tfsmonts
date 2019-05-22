import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faFolder,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';

import './FolderButton.css';

const doubleClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  // do not execute the double click of the table row
  event.stopPropagation();
};

interface IFolderButtonProps {
  title: string;
  clickHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const FolderButton = (props: IFolderButtonProps) => {
  const [over, setOver] = React.useState(false);

  const icon = over ? faFolderOpen : faFolder;

  return (
    <button className='folderButton'
      onClick={props.clickHandler}
      onDoubleClick={doubleClickHandler}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
      title={props.title}>
      <FontAwesomeIcon icon={icon} />
    </button >
  );
};

export default FolderButton;
