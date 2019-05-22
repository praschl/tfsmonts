import * as _ from 'lodash';
import * as React from 'react';

import {
  faBan,
  faCalendarAlt,
  faCheck,
  //
  faEllipsisH,
  faExclamationTriangle,
  faPlay,
  faQuestionCircle,
  //
  faSortAlphaDown,
  //
  faSortAlphaUp,
  faSortAmountDown,
  faSortAmountUp,
  faTimes,
  //
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useGlobalContext } from '../context/GlobalContext';
import './BuildsTable.css';

import { BuildDisplayStates, getBuildDropFolder, IBuildView } from '../logic/build';

import * as types from '../context/types';
import BuildHeader, { ISort } from './BuildHeader';
import ErrorDisplay from './Error/ErrorDisplay';
import FolderButton from './FolderButton';
import Spinner from './Spinner/Spinner';

import * as electron from 'electron';
import { humanizer } from '../logic/humanizer';

const iconByState: { [state in BuildDisplayStates]: IconDefinition } = {
  notStarted: faEllipsisH,
  postponed: faCalendarAlt,
  inProgress: faPlay,
  cancelling: faBan,
  //
  canceled: faBan,
  succeeded: faCheck,
  partiallySucceeded: faExclamationTriangle,
  failed: faTimes,
  //
  completed: faQuestionCircle
};

const defaultSort: ISort = { column: 'projectName', order: 'asc' };

const doubleClickHandler = (url: string) => {
  electron.shell.openExternal(url);
};

const openFolderClick = (projectName: string, buildId: number) => {
  getBuildDropFolder(projectName, buildId)
  .then(r => {
    electron.shell.openExternal(r);
  })
  .catch(e => console.error(e));
};

const mapBuildsToRows = (builds: IBuildView[]) => {
  return builds.map(b => {
    let icon = iconByState[b.displayStatus];
    let iconClass = `state-${b.displayStatus}`;
    if (!icon) { icon = faQuestionCircle; }
    if (!iconClass) { iconClass = 'unknown'; }

    const requestedBy = `by ${b.requestedBy}`;

    const sinceTime = new Date().getTime() - b.changeTime.getTime();
    const sinceDisplay = humanizer.humanize(sinceTime, { largest: 2 });

    return (
      <tr key={b.id} onDoubleClick={() => doubleClickHandler(b.openInBrowserLink)}>
        <td>{b.projectName}</td>
        <td>{b.definitionName}</td>
        <td className='resultColumn' title={b.displayStatus}>
          <FontAwesomeIcon icon={icon} className={iconClass} />
        </td>
        <td title={requestedBy}>{b.requestedFor}</td>
        <td title={`${b.sinceWhat}: ${b.sinceTimeDisplay}`}>{sinceDisplay} ago</td>
        <td>{b.durationDisplay}</td>
        <td>
          <FolderButton
            title='Open drop folder'
            clickHandler={() => openFolderClick(b.projectName, b.id)} />
        </td>
      </tr>
    );
  });
};

// tslint:disable-next-line: max-func-body-length
const BuildsTable = (props: { textFilter: string }) => {
  const { context } = useGlobalContext();

  const [sort, setSort] = React.useState(defaultSort);

  const changeSort = (column: string) => {
    const newOrder = column === sort.column
      ? (sort.order === 'asc' ? 'desc' : 'asc')
      : 'asc';
    setSort({ column: column, order: newOrder });
  };

  const textFilter = props.textFilter.toLowerCase();

  if (!context.builds) {
    return null;
  }

  let builds = context.builds;

  if (textFilter) {
    builds = builds.filter(b => {
      return b.fulltextSearch.includes(textFilter);
    });
  }

  builds = _.orderBy(builds, sort.column, sort.order);

  const buildRows = mapBuildsToRows(builds);
  const spinner = context.builds.length === 0 ? <Spinner /> : undefined;

  const errorCloseHandler = () => {
    context.dispatch({ type: types.CLEAR_ERROR });
  };

  const errorDisplay = context.error ? (
    <ErrorDisplay
      message={context.error.toString()}
      closeClick={errorCloseHandler} />)
    : null;

  return (
    <>
      {errorDisplay}
      <table className='BuildsTable'>
        <thead>
          <tr>
            <BuildHeader
              columnName='projectName'
              sort={sort}
              name='Project'
              upIcon={faSortAlphaUp}
              downIcon={faSortAlphaDown}
              changeSort={changeSort} />
            <BuildHeader
              columnName='definitionName'
              sort={sort}
              name='Definition'
              upIcon={faSortAlphaUp}
              downIcon={faSortAlphaDown}
              changeSort={changeSort} />
            <BuildHeader
              columnName='displayStatus'
              sort={sort}
              name='Status'
              upIcon={faSortAmountUp}
              downIcon={faSortAmountDown}
              changeSort={changeSort} />
            <BuildHeader
              columnName='requestedFor'
              sort={sort}
              name='Requested for'
              upIcon={faSortAlphaUp}
              downIcon={faSortAlphaDown}
              changeSort={changeSort} />
            <BuildHeader
              columnName='changeTime'
              sort={sort}
              name='Changed'
              title='Status changed to&#013;Queued/Started/Finished'
              upIcon={faSortAmountUp}
              downIcon={faSortAmountDown}
              changeSort={changeSort} />
            <BuildHeader
              columnName='duration'
              sort={sort}
              name='Duration'
              upIcon={faSortAmountUp}
              downIcon={faSortAmountDown}
              changeSort={changeSort} />
            <BuildHeader
              columnName='openDrop'
              name=''
              title='Open drop folder'
              // tslint:disable-next-line: no-empty
              changeSort={() => { }} />
          </tr>
        </thead>
        <tbody>
          {buildRows}
        </tbody>
      </table>
      {spinner}
    </>);
};

export default BuildsTable;
