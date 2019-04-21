import * as React from 'react';
import { Redirect } from 'react-router';
import BuildsList from '../containers/BuildsList';
import { useGlobalContext } from '../context/GlobalContext';

export default function Home() {
  const { context } = useGlobalContext();

  let redirect: JSX.Element | null = null;
  if (!context.config.tfsUrl) {
    redirect = <Redirect to='/config' />;
  }

  return (
    <>
      {redirect}
      <BuildsList />
    </>
  );
}
