import { useEffect, useState, type DependencyList } from 'react';
import type { Observable } from '../data/observable';

/** Latest value of an observable; undefined while the first value loads. */
export function useObservable<T>(createObservable: () => Observable<T>, deps: DependencyList): T | undefined {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const subscription = createObservable().subscribe(setValue, (error) =>
      console.error('Observable failed', error),
    );
    return () => subscription.unsubscribe();
    // Deps are supplied by the caller, like useEffect itself.
  }, deps);

  return value;
}
