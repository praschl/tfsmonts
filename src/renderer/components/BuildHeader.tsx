import * as React from 'react';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IBuildHeaderProps {
  name: string;
  title?: string;
  columnName: string;
  sort: ISort;
  upIcon: IconDefinition;
  downIcon: IconDefinition;
  changeSort(columnName: string): void;
}

export interface ISort {
  column: string;
  order: 'asc' | 'desc';
}

const BuildHeader = (props: IBuildHeaderProps) => {
  let sortIcon: JSX.Element = <></>;
  if (props.sort.column === props.columnName) {
    const icon = props.sort.order === 'asc' ? props.upIcon : props.downIcon;
    sortIcon = <FontAwesomeIcon icon={icon} />;
  }

  const changeSort = () => {
    props.changeSort(props.columnName);
  };

  return (
    <th onClick={changeSort}>
      <div>
        <label title={props.title}>{props.name}</label>
        {sortIcon}
      </div>
    </th>
  );
};

export default BuildHeader;
