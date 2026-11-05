import type { Exercise } from './types';

export class EmptyNameError extends Error {
  constructor() {
    super('Le nom ne peut pas être vide.');
  }
}

export class DuplicateExerciseNameError extends Error {
  constructor(readonly existing: Exercise) {
    super(`« ${existing.name} » existe déjà.`);
  }
}

export class ExerciseInUseError extends Error {
  constructor() {
    super('Cet exo est utilisé : il ne peut pas être supprimé.');
  }
}

export class MainProgramDeletionError extends Error {
  constructor() {
    super('Choisis un autre programme principal avant de supprimer celui-ci.');
  }
}
