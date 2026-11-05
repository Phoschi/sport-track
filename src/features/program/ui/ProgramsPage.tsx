import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/ui/Button';
import { useObservable } from '../../../shared/ui/useObservable';
import { useProgramRepositories } from '../data/ProgramRepositoriesContext';
import styles from './program.module.css';

export function ProgramsPage() {
  const { programs: repository } = useProgramRepositories();
  const programs = useObservable(() => repository.watchAll(), [repository]);
  const mainProgramId = useObservable(() => repository.watchMainProgramId(), [repository]);
  const navigate = useNavigate();
  const [newName, setNewName] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function createProgram(event: FormEvent) {
    event.preventDefault();
    try {
      const program = await repository.create(newName ?? '');
      navigate(`/programs/${program.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  if (!programs) return null;
  const sorted = [...programs].sort((a, b) => Number(b.id === mainProgramId) - Number(a.id === mainProgramId));

  return (
    <section>
      <h1>Programmes</h1>
      {sorted.length === 0 && <p className="muted">Aucun programme. Crée le premier : il deviendra ton programme principal.</p>}
      <ul className={styles.list}>
        {sorted.map((program) => (
          <li key={program.id}>
            <Link className={styles.item} to={`/programs/${program.id}`}>
              <span>{program.name}</span>
              <span className={styles.badge}>
                {program.id === mainProgramId ? '★ Principal' : `${program.sessions.length} séance(s)`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {newName === null ? (
        <div className={styles.stack}>
          <Button variant="primary" fullWidth onClick={() => setNewName('')}>+ Programme</Button>
          <Link className={styles.item} to="/programs/exercises">Catalogue d'exos →</Link>
        </div>
      ) : (
        <form className={styles.stack} onSubmit={createProgram}>
          <label>
            Nom du programme
            <input autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
          <div className={styles.row}>
            <Button onClick={() => setNewName(null)}>Annuler</Button>
            <Button type="submit" variant="primary">Créer</Button>
          </div>
        </form>
      )}
    </section>
  );
}
