import * as settings from 'electron-settings';

// tslint:disable: no-backbone-get-set-outside-model

export const tfsUrl = () => <string>settings.get('tfsurl', '');
export const setTfsUrl = (url: string) => { settings.set('tfsurl', url); };

export const tfsDays = () => <number>settings.get('tfsdays', 3);
export const setTfsDays = (days: number) => { settings.set('tfsdays', days); };
