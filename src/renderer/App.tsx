import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import Config from './pages/Config';
import Home from './pages/Home';

import { CustomRouter } from './router/CustomRouter';

import { GlobalContextProvider, useGlobalContextAutoUpdate } from './context/GlobalContext';

const App = () => {
  useGlobalContextAutoUpdate();

  return (
    <CustomRouter>
      <GlobalContextProvider>
        <Switch>
          <Route path='/config' component={Config} />
          <Route path='/' exact component={Home} />
        </Switch>
      </GlobalContextProvider>
    </CustomRouter>
  );
};

export default App;
