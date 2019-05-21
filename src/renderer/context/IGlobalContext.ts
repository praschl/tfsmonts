import * as React from 'react';
import { IBuildView } from '../logic/build';
import { IProjectView } from '../logic/project';

export interface IGlobalContext {
  dispatch: React.Dispatch<IAction>;
  projects: IProjectView[];
  builds: IBuildView[];
  lastBuildsFetchDate: Date | null;
  error?: string;
  config: {
    tfsUrl: string;
    tfsDays: number;
  };
}

export interface IAction {
// tslint:disable-next-line: no-reserved-keywords // DISABLED because "type" is very commonly used for actions
  type: string;
  projects?: IProjectView[];
  builds?: IBuildView[];
  requestDate?: Date;
  tfsUrl?: string;
  tfsDays?: number;
  error?: string;
}
