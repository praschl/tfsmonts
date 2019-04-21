import * as React from 'react';

import { RouteChildrenProps } from 'react-router';
import { HashRouter, Route } from 'react-router-dom';

const initialContext = {} as any as RouteChildrenProps; // fake instance is overwritten in CustomRouter

const RouterContext = React.createContext<RouteChildrenProps>(initialContext);

const CustomRouter = (props: { children: object }) => (
  <HashRouter>
    <Route>
      {(routeProps) => (
        <RouterContext.Provider value={routeProps}>
          {props.children}
        </RouterContext.Provider>
      )}
    </Route>
  </HashRouter>
);

function useRouter(): RouteChildrenProps {
  return React.useContext(RouterContext);
}

export { CustomRouter, RouterContext, useRouter };
