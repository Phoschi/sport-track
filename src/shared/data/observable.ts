export type Subscription = { unsubscribe(): void };

/** Minimal observable contract; Dexie's liveQuery satisfies it, a future HTTP/polling source can too. */
export type Observable<T> = {
  subscribe(onNext: (value: T) => void, onError?: (error: unknown) => void): Subscription;
};
