import {
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import './MessagePanel.css';

type MessagePanelProps = {
  message: string;
  level: 'warn' | 'error';
  closeClick(): void;
};

function MessagePanel(props: MessagePanelProps) {
  const styles = ['message-panel', props.level].join(' ');

  return (
    <div className={styles}>
      <span>{props.message}</span>
      <button onClick={props.closeClick}><FontAwesomeIcon icon={faTimes} /></button>
    </div>
  );
}

export default MessagePanel;
