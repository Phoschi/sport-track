import { useState } from 'react';
import { useProgramRepositories } from '../data/ProgramRepositoriesContext';
import { DuplicateExerciseNameError } from '../domain/errors';
import { findExerciseByName } from '../domain/exerciseName';
import { searchExercises } from '../domain/searchExercises';
import type { Exercise } from '../domain/types';
import styles from './ExerciseAutocomplete.module.css';

const MAX_SUGGESTIONS = 6;

type ExerciseAutocompleteProps = {
  exercises: readonly Exercise[];
  selected: Exercise | undefined;
  onSelect: (exercise: Exercise | undefined) => void;
};

export function ExerciseAutocomplete({ exercises, selected, onSelect }: ExerciseAutocompleteProps) {
  const { exercises: repository } = useProgramRepositories();
  const [query, setQuery] = useState(selected?.name ?? '');
  const [error, setError] = useState('');

  const typing = query.trim() !== '' && query !== selected?.name;
  const suggestions = typing ? searchExercises(exercises, query).slice(0, MAX_SUGGESTIONS) : [];
  const canCreate = typing && !findExerciseByName(exercises, query);

  function choose(exercise: Exercise) {
    setQuery(exercise.name);
    setError('');
    onSelect(exercise);
  }

  async function create() {
    try {
      choose(await repository.create(query));
    } catch (caught) {
      // Another tab may have created it meanwhile: pick the existing one.
      if (caught instanceof DuplicateExerciseNameError) choose(caught.existing);
      else setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  return (
    <div className={styles.wrapper}>
      <label>
        Exo
        <input
          value={query}
          autoFocus={!selected}
          autoComplete="off"
          placeholder="Tape quelques lettres…"
          onChange={(event) => {
            setQuery(event.target.value);
            if (selected) onSelect(undefined);
          }}
        />
      </label>
      {(suggestions.length > 0 || canCreate) && (
        <ul className={styles.suggestions}>
          {suggestions.map((exercise) => (
            <li key={exercise.id}>
              <button type="button" onClick={() => choose(exercise)}>{exercise.name}</button>
            </li>
          ))}
          {canCreate && (
            <li>
              <button type="button" className={styles.create} onClick={create}>
                + Créer « {query.trim()} »
              </button>
            </li>
          )}
        </ul>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
