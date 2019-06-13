import * as React from 'react';

import Config from './pages/Config';
import Home from './pages/Home';

import { GlobalContextProvider, useGlobalContextAutoUpdate } from './context/GlobalContext';
import { Pagetype } from './context/PageContext';

import { config } from './context/config';

function getPage(page: Pagetype, setPage: React.Dispatch<React.SetStateAction<Pagetype>>) {
  if (page === '/config') {
    return <Config setPage={setPage} />;
  }

  return <Home setPage={setPage} />;
}

const App = () => {
  useGlobalContextAutoUpdate();

  let startPage: Pagetype = '/';
  if (!config.tfsUrl) {
    startPage = '/config';
  }
  const [page, setPage] = React.useState<Pagetype>(startPage);

  const pageToRender = getPage(page, setPage);

  return (
    <GlobalContextProvider>
      {pageToRender}
    </GlobalContextProvider>
  );
};

export default App;
