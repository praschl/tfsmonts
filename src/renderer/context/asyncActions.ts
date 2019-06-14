import * as React from 'react';

import * as build from '../logic/build';
import * as project from '../logic/project';
import { IAction } from './IGlobalContext';
import * as types from './types';

import { config } from './config';

// methods here should
// get the parameters they need and dispatch() as parameter
// dispatch only in async methods (.then)
// not pass dispatch to other methods

const fetchProjects = (dispatch: React.Dispatch<IAction>, initial: boolean) => {
  project.fetchProjectsAsync(config.tfsUrl)
    .then(projects => {
      dispatch({ type: types.FETCH_PROJECTS_SUCCESS, projects: projects });
      if (initial) {
        build.dispatchFetchBuildsInitial(dispatch);
      }
    })
    .catch(error => {
      dispatch({ type: types.SET_ERROR, error: {text: (<Error>error).toString(), level: 'error'} });
    });
};

const fetchBuilds = (
  lastBuildsFetchDate: Date | undefined,
  projects: project.IProjectView[],
  dispatch: React.Dispatch<IAction>
) => {
  const requestParams = build.getBuildsParams(lastBuildsFetchDate, config.tfsDays);

  const requestStartDate = new Date();

  build.fetchBuildsAsync({
    url: config.tfsUrl,
    projects: projects,
    requestParams: requestParams
  })
    .then(builds => {
      dispatch({ type: types.FETCH_BUILDS_SUCCESS, builds: builds, requestDate: requestStartDate });
    })
    .catch(error => {
      dispatch({ type: types.SET_ERROR, error: {text: (<Error>error).toString(), level: 'error'} });
    });
};

export { fetchProjects, fetchBuilds };
