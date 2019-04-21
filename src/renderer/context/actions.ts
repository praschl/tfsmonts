import { IBuildView } from '../logic/build';
import { IAction, IGlobalContext } from './IGlobalContext';

// functions in this file should
// get context and optionally action as parameter
// return new context

const fetchProjectsSuccess = (context: IGlobalContext, action: IAction): IGlobalContext => {
  let result: IGlobalContext = context;
  const projects = action.projects;

  if (projects !== undefined) {
    projects.forEach(p => {
      const found = context.projects.findIndex(x => x.id === p.id) >= 0;
      // naive implementation:
      // when one was not found, change the array
      // this doesn't take into account:
      // project is deleted (which is probably going to happen: almost never)
      // rerender probably more than required (but very rarely anyways)
      if (!found) {
        result = { ...context, projects: projects };

        return result;
      }
    });
  }

  return result;
};

const fetchBuildsSuccess = (context: IGlobalContext, action: IAction): IGlobalContext => {
  const foundBuilds = <IBuildView[]>action.builds;
  const knownBuilds = [...context.builds];

  // if a new id is not in context -> add it
  // if the build in context is not finished -> replace it
  // else dont touch
  foundBuilds.forEach(fb => {
    const foundIndex = knownBuilds.findIndex(b => b.id === fb.id);
    if (foundIndex >= 0) {
      if (knownBuilds[foundIndex].finishTime === null) {
        knownBuilds[foundIndex] = fb;
      }
    } else {
      knownBuilds.push(fb);
    }
  });

  // HACK: if we didn't find any builds, next time try to get the whole list, not just the changes.
  // this needs to be fixed, and has somehow todo with multiple requests going on
  const nextDate = knownBuilds.length > 0 ? <Date>action.requestDate : null;

  return {
    ...context,
    builds: knownBuilds,
    lastBuildsFetchDate: nextDate
  };
};

const setTfsUrl = (context: IGlobalContext, action: IAction): IGlobalContext => {
  return {
    ...context,
    projects: [],
    builds: [],
    lastBuildsFetchDate: null,
    config: {
      ...context.config,
      tfsUrl: <string>action.tfsUrl
    }
  };
};

const setError = (context: IGlobalContext, action: IAction): IGlobalContext => {
  return { ...context, error: action.error };
};

const clearError = (context: IGlobalContext): IGlobalContext => {
  return { ...context, error: undefined };
};

export { fetchProjectsSuccess, fetchBuildsSuccess, setTfsUrl, setError, clearError };
