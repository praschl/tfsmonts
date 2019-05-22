import * as React from 'react';
import { Redirect } from 'react-router';
import BuildsList from '../containers/BuildsList';

import * as config from '../context/GlobalConfig';

export default function Home() {
  let redirect: JSX.Element | null = null;
  if (!config.tfsUrl()) {
    redirect = <Redirect to='/config' />;
  }

  return (
    <>
      {redirect}
      <BuildsList />
    </>
  );
}
