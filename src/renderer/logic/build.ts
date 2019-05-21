import Axios from 'axios';
import { humanizer } from './humanizer';

import { IAction } from '../context/IGlobalContext';
import * as types from '../context/types';
import { IAxiosResult } from './axiosHelpers';
import { IProjectView } from './project';

type BuildResults = 'succeeded' | 'partiallySucceeded' | 'failed' | 'canceled';

type BuildStates = 'inProgress' | 'completed' | 'cancelling' | 'postponed' | 'notStarted';

type BuildDisplayStates = BuildResults | BuildStates;

interface ITfsUser {
  displayName: string;
  uniqueName: string;
}

interface ITfsBuild {
  result: BuildResults;
  id: number;
  queueTime: string;
  finishTime: string;
  startTime: string;
  status: BuildStates;
  project: { name: string };
  definition: { name: string };
  requestedBy: ITfsUser;
  requestedFor: ITfsUser;
  _links: {
    web: {
      href: string;
    };
  };
}

interface ITfsBuildsResult {
  count: number;
  value: ITfsBuild[];
}

interface IBuildView {
  id: number;
  projectName: string;
  definitionName: string;
  status: string;
  result?: string;
  // displayStatus: when status != completed, this is the status, when status == completed, its the result.
  displayStatus: BuildDisplayStates;
  requestedBy: string;
  requestedFor: string;
  queueTime: Date;
  startTime: Date | null;
  finishTime: Date | null;
  changeTime: Date;
  duration: number; // milliseconds of the duration
  durationDisplay: string;
  sinceTimeDisplay: string;
  sinceWhat: string;
  fulltextSearch: string;
  openInBrowserLink: string;
}

const dispatchFetchBuildsInitial = (dispatch: React.Dispatch<IAction>) => {
  dispatch({ type: types.FETCH_BUILDS_INITIAL });
};

const dispatchFetchBuilds = (dispatch: React.Dispatch<IAction>) => {
  dispatch({ type: types.FETCH_BUILDS });
};

const getBuildsParams = (lastDate: Date | null) => {
  const openBuildsParams = {
    ['api-version']: 2.3,
    statusFilter: 'inProgress,cancelling,postponed,notStarted'
  };

  // request builds since last request
  // if this is the first request, get the builds of the last few days.
  let requestMinDate: Date;
  if (lastDate === null) {
    requestMinDate = new Date();
    requestMinDate.setDate(requestMinDate.getDate() - 3);
  } else {
    requestMinDate = lastDate;
  }

  const finishedBuildsParams = {
    // api-version=2.3
    // this is for the old TFS version i can test against, don't have a current version - sorry
    // without this i would only get empty result, because there are only XAML builds on the tfs.
    ['api-version']: 2.3,
    //['$top']: 5,
    minFinishTime: requestMinDate
  };

  return [finishedBuildsParams, openBuildsParams];
};

const mapBuild = (build: ITfsBuild): IBuildView => {
  // tslint:disable: no-unsafe-any
  const displayStatus = build.status === 'completed' ? build.result : build.status;
  const start = build.startTime ? new Date(build.startTime).getTime() : new Date().getTime();
  const end = build.finishTime ? new Date(build.finishTime).getTime() : new Date().getTime();

  const duration = end - start;
  const durationDisplay = humanizer.humanize(duration, { largest: 1 });

  const changeTime = new Date(build.finishTime || build.startTime || build.queueTime);
  const sinceTimeDisplay = changeTime.getDate() === new Date().getDate()
    ? changeTime.toLocaleTimeString()
    : changeTime.toLocaleString();

  const sinceWhat = build.finishTime ? 'finished'
    : (build.startTime ? 'started' : 'queued');

  return {
    id: build.id,
    projectName: build.project.name,
    definitionName: build.definition.name,
    status: build.status,
    result: build.result,
    displayStatus: displayStatus,
    requestedBy: build.requestedBy.displayName,
    requestedFor: build.requestedFor.displayName,
    queueTime: new Date(build.queueTime),
    startTime: build.startTime ? new Date(build.startTime) : null,
    finishTime: build.finishTime ? new Date(build.finishTime) : null,
    changeTime: changeTime,
    duration: duration,
    durationDisplay: durationDisplay,
    sinceTimeDisplay: sinceTimeDisplay,
    sinceWhat: sinceWhat,
    fulltextSearch: (`_${build.project.name}_${build.definition.name}_${displayStatus}
_${build.requestedBy.displayName}_${build.requestedBy.uniqueName}
_${build.requestedFor.displayName}_${build.requestedFor.uniqueName}_`).toLowerCase(),
    openInBrowserLink: build._links.web.href
  };

  // tslint:enable: no-unsafe-any
};

interface IFetchBuildsAsyncParams {
  url: string;
  projects: IProjectView[];
  requestParams: any[];
}

const fetchBuildsAsync = async (params: IFetchBuildsAsyncParams) => {
  if (!params.url) { return; }

  const allPromises = params.projects.map(project => {
    const requestUrl = `${params.url}/DefaultCollection/${project.name}/_apis/build/builds`;

    return params.requestParams.map(async p => {
      const r: IAxiosResult<ITfsBuildsResult> = await Axios.get(requestUrl, {
        params: p
      });

      return r.data.value;
    });
  })
    .flat();

  const allResults = (await Promise.all(allPromises))
    .flat();

  return allResults.map(mapBuild);
};

export {
  BuildDisplayStates,
  IBuildView,
  getBuildsParams,
  fetchBuildsAsync,
  dispatchFetchBuilds,
  dispatchFetchBuildsInitial
};
