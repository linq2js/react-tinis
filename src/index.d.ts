import {State, Loadable} from 'tinis';

export const useValue: UseValueExports;
export const useLoadable: UseLoadableExports;

interface UseValueExports extends Function {
  <T>(state: State<T>): T;
  (states: State<any>[]): any[];
}

interface UseLoadableExports {
  <T>(state: State<T>): Loadable<T>;
  (states: State<any>[]): Loadable<any>[];
}
