export class WorkoutInProgressError extends Error {
  constructor(readonly workoutId: string) {
    super('Une séance est déjà en cours.');
  }
}

export class SessionNotFoundError extends Error {
  constructor() {
    super('Cette séance n’existe plus dans le programme.');
  }
}
