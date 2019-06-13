export type Pagetype = '/' | '/config';

export interface ISetPageProps {
  setPage: React.Dispatch<React.SetStateAction<Pagetype>>;
}
