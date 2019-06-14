import * as types from './types';

import * as actions from './actions';
import * as asyncActions from './asyncActions';

import { IAction, IGlobalContext } from './IGlobalContext';

type reducerType = (context: IGlobalContext, action: IAction) => IGlobalContext;

const reducer: reducerType =
  (context: IGlobalContext, action: IAction): IGlobalContext => {
    switch (action.type) {
      case types.FETCH_PROJECTS_INITIAL: {
        asyncActions.fetchProjects(context.dispatch, true);
        return { ...context, builds: [], projects: [], lastBuildsFetchDate: undefined };
      }
      case types.FETCH_PROJECTS: {
        asyncActions.fetchProjects(context.dispatch, false);
        return context;
      }
      case types.FETCH_PROJECTS_SUCCESS: return actions.fetchProjectsSuccess(context, action);
      //
      case types.FETCH_BUILDS_INITIAL: {
        asyncActions.fetchBuilds(undefined,
          context.projects,
          context.dispatch);
        return context;
      }
      case types.FETCH_BUILDS: {
        asyncActions.fetchBuilds(context.lastBuildsFetchDate,
          context.projects,
          context.dispatch);
        return context;
      }
      case types.FETCH_BUILDS_SUCCESS: return actions.fetchBuildsSuccess(context, action);
      //
      case types.SET_ERROR: return actions.setError(context, action);
      case types.CLEAR_ERROR: return actions.clearError(context);
      //
      default: throw new Error(`Unknown action '${action.type}'`);
    }
  };

export default reducer;
