import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';

const langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
langService.addLanguage('short', {
  y: () => 'yr',
  mo: () => 'mth',
  w: () => 'wk',
  d: () => 'd',
  h: () => 'h',
  m: () => 'm',
  s: () => 's',
  ms: () => 'ms',
  decimal: '.'
});

const humanizer: HumanizeDuration = new HumanizeDuration(langService);
humanizer.setOptions({
  round: true,
  delimiter: ' ',
  language: 'short',
  spacer: ''
});

export { humanizer };
