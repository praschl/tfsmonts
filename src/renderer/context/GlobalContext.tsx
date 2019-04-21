import * as React from 'react';

import reducer from './reducer';

import { useInterval } from '../hooks/useInterval';

import { IAction, IGlobalContext } from './IGlobalContext';

import * as build from '../logic/build';
import * as project from '../logic/project';

import * as settings from 'electron-settings';

const tfsUrl: string = settings.get('tfsurl', '') as string;

const initialContext: IGlobalContext = {
  dispatch: (action: IAction) => undefined, // this is for intellisense and will be overridden at (1)
  projects: [],
  builds: [],
  lastBuildsFetchDate: null,
  config: {
    // DISABLED: default will be removed soonish (when load/save of settings is implemented)
    // tslint:disable-next-line: no-http-string
    tfsUrl: tfsUrl
  }
};

const GlobalContext = React.createContext(initialContext);

function GlobalContextProvider(props: { children: object }) {
  const [context, dispatch] = React.useReducer(reducer, initialContext);
  context.dispatch = dispatch; // (1)

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
}

const useGlobalContext = () => {
  const context = React.useContext(GlobalContext);

  return { context };
};

const useGlobalContextAutoUpdate = () => {
  const { context } = useGlobalContext();

  React.useEffect(() => {
    project.dispatchFetchProjects(context.dispatch);
  }, []);

  useInterval(() => {
    project.dispatchFetchProjects(context.dispatch);
  }, 15000);

  useInterval(() => {
    build.dispatchFetchBuilds(context.dispatch);
  }, 5000);

  return { context };
};

export { GlobalContext, GlobalContextProvider, useGlobalContext, useGlobalContextAutoUpdate };
