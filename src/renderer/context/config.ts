import * as settings from 'electron-settings';

// tslint:disable: no-backbone-get-set-outside-model

class GlobalConfig {
  public tfsUrl = <string>settings.get('tfsurl', '');
  public tfsDays = <number>settings.get('tfsdays', 3);

  public setTfsUrl = (url: string) => {
    this.tfsUrl = url;
    settings.set('tfsurl', url);
  }

  public setTfsDays = (days: number) => {
    this.tfsDays = days;
    settings.set('tfsdays', days);
  }
}

export const config = new GlobalConfig();
