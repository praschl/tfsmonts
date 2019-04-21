import {
  faArrowRight,
  faCheckCircle,
  faTimesCircle,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';
import * as settings from 'electron-settings';
import * as React from 'react';

import BoilerPlateCredits from '../components/credits/BoilerPlateCredits';
import IconCredits from '../components/credits/IconCredits';
import NavButton from '../components/NavButton';
import NavHeader from '../components/NavHeader';
import { useGlobalContext } from '../context/GlobalContext';
import * as types from '../context/types';
import { useRouter } from '../router/CustomRouter';
import './Config.css';

type UrlState = 'valid' | 'invalid';

const iconsByState: { [key in UrlState]: IconDefinition } = {
  invalid: faTimesCircle,
  valid: faCheckCircle
};

function checkUrlIsValid(url: string, setTfsUrlState: React.Dispatch<React.SetStateAction<UrlState>>) {
  if (url.endsWith('/')) {
    setTfsUrlState('invalid');

    return;
  }

  const requestUrl = `${url}/DefaultCollection/_apis/projects`;

  Axios.get(requestUrl)
    .then(_ => {
      setTfsUrlState('valid');
    }, _ => {
      setTfsUrlState('invalid');
    });
}

function Config() {
  const router = useRouter();
  const { context } = useGlobalContext();
  const [tfsUrl, setTfsUrl] = React.useState(context.config.tfsUrl);

  const initialTfsUrlState = !tfsUrl ? 'invalid' : 'valid';
  const [tfsUrlState, setTfsUrlState] = React.useState<UrlState>(initialTfsUrlState);

  const exitButtonEnabled = tfsUrlState === 'valid';

  const exitClickHandler = () => {
    // tslint:disable-next-line: no-backbone-get-set-outside-model
    settings.set('tfsurl', tfsUrl);

    context.dispatch({ type: types.SET_TFS_URL, tfsUrl: tfsUrl });
    router.history.push('/');
  };

  const urlChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setTfsUrl(url);

    checkUrlIsValid(url, setTfsUrlState);
  };

  const icon: IconDefinition = iconsByState[tfsUrlState];

  const checkStyles = ['tfsUrlCheck', tfsUrlState];

  return (
    <>
      <NavHeader title='Builds'>
        <NavButton onClick={exitClickHandler} enabled={exitButtonEnabled}>
          <FontAwesomeIcon icon={faArrowRight} />
        </NavButton>
      </NavHeader>
      <div className='config'>
        <label htmlFor='tfsUrl'>Enter the url to your TFS here: </label>
        <br />
        <input id='tfsUrl'
          className='url'
          type='text'
          placeholder='https://your.tfs:8080/tfs'
          onChange={urlChangeHandler}
          value={tfsUrl} />

        <span className={checkStyles.join(' ')}>
          <FontAwesomeIcon icon={icon} />
        </span>
      </div>
      <div style={{ height: '100px' }}></div>
      <BoilerPlateCredits />
      <IconCredits />
    </>);
}

export default Config;
