import Axios from 'axios';

import { IAction } from '../context/IGlobalContext';
import * as types from '../context/types';
import { IAxiosResult } from './axiosHelpers';

interface ITfsProject {
  id: string;
  name: string;
  description: string;
}

interface ITfsProjectsResult {
  count: number;
  value: ITfsProject[];
}

interface IProjectView {
  id: string;
  name: string;
}

const dispatchFetchProjectsInitial = (dispatch: React.Dispatch<IAction>) => {
  dispatch({ type: types.FETCH_PROJECTS_INITIAL });
};

const dispatchFetchProjects = (dispatch: React.Dispatch<IAction>) => {
  dispatch({ type: types.FETCH_PROJECTS });
};

const fetchProjectsAsync = async (url: string) => {
  if (!url) { return []; }

  const requestUrl = `${url}/DefaultCollection/_apis/projects`;

  // fetch works... axios doesn't work
  fetch(requestUrl , { credentials: 'include'})
  .then(r => r.json())
  .then (r => {
    console.log(r);
  })
  .catch(e => {
    console.log('ERROR: FETCH FAILED');
    console.log(e);
  });

  const projectsResponse: IAxiosResult<ITfsProjectsResult> = await Axios.get(requestUrl);

  const projects: IProjectView[] = projectsResponse.data.value.map(p => {
    const result: IProjectView = { id: p.id, name: p.name };

    return result;
  });

  return projects;
};

export { IProjectView, dispatchFetchProjects, dispatchFetchProjectsInitial, fetchProjectsAsync };
