import * as React from 'react';

import BuildsList from '../containers/BuildsList';
import { ISetPageProps } from '../context/PageContext';

export default function Home(props: ISetPageProps) {
  return (
    <>
      <BuildsList setPage={props.setPage} />
    </>
  );
}
