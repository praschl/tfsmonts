import Axios from 'axios';

import { IAction } from '../context/IGlobalContext';
import * as types from '../context/types';

interface IProjectView {
  id: string;
  name: string;
}

const dispatchFetchProjects = (dispatch: React.Dispatch<IAction>) => {
  dispatch({ type: types.FETCH_PROJECTS });
};

const fetchProjectsAsync = async (url: string) => {
  if (!url) { return []; }

  const requestUrl = `${url}/DefaultCollection/_apis/projects`;

  const projectsResponse = await Axios.get(requestUrl);

  // tslint:disable: no-unsafe-any
  const projects: IProjectView[] = projectsResponse.data.value.map((p: any) => {
    // tslint:disable-next-line: no-unnecessary-local-variable // DISABLED its here to ensure the type
    const result: IProjectView = { id: p.id, name: p.name };

    return result;
  });
  // tslint:enable: no-unsafe-any

  return projects;
};

export { IProjectView, dispatchFetchProjects, fetchProjectsAsync };
