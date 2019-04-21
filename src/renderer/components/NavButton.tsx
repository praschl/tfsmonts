import * as React from 'react';
import './NavButton.css';

interface INavButtonProps {
  children: object;
  enabled: boolean;
  onClick(): void;
}

function NavButton(props: INavButtonProps) {
  return (
    <button className='navButton' onClick={props.onClick} disabled={!props.enabled}>
    {props.children}
    </button>
  );
}

export default NavButton;
