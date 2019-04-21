import * as React from 'react';

import './NavHeader.css';

function NavHeader(props: { children: object; title: string }) {
  return (
    <div className='navHeader'>
      <label>{props.title}</label>
      <span>
        {props.children}
      </span>
    </div>
  );
}

export default NavHeader;
