import * as React from 'react';

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BuildsTable from '../components/BuildsTable';
import NavButton from '../components/NavButton';
import NavHeader from '../components/NavHeader';
import { useRouter } from '../router/CustomRouter';

import './BuildsList.css';

function BuildsList() {
  const [textFilter, setTextFilter] = React.useState('');
  const routeProps = useRouter();

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFilter(event.target.value);
  };

  const settingsClickHandler = () => {
    routeProps.history.push('/config');
  };

  return (
    <>
      <NavHeader title='Builds'>
        <input id='builds-search'
          type='text'
          placeholder='Type to filter'
          value={textFilter}
          onChange={onFilterChange} />
        <NavButton onClick={settingsClickHandler} enabled>
          <FontAwesomeIcon icon={faCog} />
        </NavButton>
      </NavHeader>
      <div className='tableBorder'>
        <div className='tableContainer'>
          <BuildsTable textFilter={textFilter} />
        </div>
      </div>
    </>);
}

export default BuildsList;
