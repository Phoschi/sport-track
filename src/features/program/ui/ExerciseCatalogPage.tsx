import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../shared/ui/Button';
import { useObservable } from '../../../shared/ui/useObservable';
import { useProgramRepositories } from '../data/ProgramRepositoriesContext';
import { findExerciseByName } from '../domain/exerciseName';
import { collectProgrammedExerciseIds } from '../domain/exerciseStatus';
import { searchExercises } from '../domain/searchExercises';
import type { Exercise } from '../domain/types';
import { ExerciseSheet } from './ExerciseSheet';
import { useExerciseCatalog } from './useExerciseCatalog';
import styles from './program.module.css';

export function ExerciseCatalogPage() {
  const repositories = useProgramRepositories();
  const { exercises } = useExerciseCatalog();
  const programs = useObservable(() => repositories.programs.watchAll(), [repositories]) ?? [];
  const programmedIds = useMemo(() => collectProgrammedExerciseIds(programs), [programs]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [error, setError] = useState('');

  const results = searchExercises(exercises, query);
  const canCreate = query.trim() !== '' && !findExerciseByName(exercises, query);

  function create() {
    repositories.exercises.create(query).then(
      () => setQuery(''),
      (caught: unknown) => setError(caught instanceof Error ? caught.message : String(caught)),
    );
  }

  return (
    <section>
      <Link className={styles.backLink} to="/programs">← Programmes</Link>
      <h1>Catalogue d'exos</h1>
      <label>
        Rechercher ou créer
        <input value={query} autoComplete="off" onChange={(event) => { setQuery(event.target.value); setError(''); }} />
      </label>
      {canCreate && <Button variant="ghost" fullWidth onClick={create}>+ Créer « {query.trim()} »</Button>}
      {error && <p className="error">{error}</p>}
      {exercises.length === 0 && <p className="muted">Aucun exo pour l'instant.</p>}
      <ul className={styles.list} style={{ marginTop: 'var(--space-4)' }}>
        {results.map((exercise) => (
          <li key={exercise.id}>
            <button type="button" className={styles.item} onClick={() => setEditing(exercise)}>
              <span>{exercise.name}</span>
              {!programmedIds.has(exercise.id) && <span className={styles.badge}>not trained anymore</span>}
            </button>
          </li>
        ))}
      </ul>
      {editing && <ExerciseSheet key={editing.id} exercise={editing} onClose={() => setEditing(null)} />}
    </section>
  );
}
