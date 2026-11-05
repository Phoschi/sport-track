import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createId } from '../../../shared/domain/id';
import { Button } from '../../../shared/ui/Button';
import { useObservable } from '../../../shared/ui/useObservable';
import { useProgramRepositories } from '../data/ProgramRepositoriesContext';
import { addSession, createSession, moveSession, removeSession, replaceSession } from '../domain/programEditing';
import { movePlannedExercise } from '../domain/sessionEditing';
import type { Program, SessionTemplate } from '../domain/types';
import { DeleteProgramButton } from './DeleteProgramButton';
import { ProgramHeader } from './ProgramHeader';
import { ProgramSheets, type OpenSheet } from './ProgramSheets';
import { SessionCard } from './SessionCard';
import { useExerciseCatalog } from './useExerciseCatalog';
import styles from './program.module.css';

export function ProgramPage() {
  const { programId = '' } = useParams();
  const { programs: repository } = useProgramRepositories();
  const program = useObservable(() => repository.watchById(programId), [repository, programId]);
  const mainProgramId = useObservable(() => repository.watchMainProgramId(), [repository]);
  const { byId } = useExerciseCatalog();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<OpenSheet | null>(null);
  const [error, setError] = useState('');

  if (program === undefined) return null;
  if (program === null) {
    return (
      <section>
        <h1>Programme introuvable</h1>
        <Link to="/programs">← Programmes</Link>
      </section>
    );
  }
  const current: Program = program;

  function run(action: Promise<unknown>) {
    action.then(() => setError('')).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : String(caught)));
  }
  const save = (next: Program) => run(repository.save(next));
  const saveSession = (session: SessionTemplate) => save(replaceSession(current, session));

  function deleteProgram() {
    if (!window.confirm(`Supprimer le programme « ${current.name} » ? Les séances déjà faites sont conservées.`)) return;
    run(repository.delete(current.id).then(() => navigate('/programs')));
  }

  return (
    <section>
      <Link className={styles.backLink} to="/programs">← Programmes</Link>
      <ProgramHeader
        key={current.id}
        program={current}
        mainProgramId={mainProgramId}
        onRename={(name) => save({ ...current, name })}
        onSetMain={() => run(repository.setMain(current.id))}
      />
      {error && <p className="error">{error}</p>}
      <h2 style={{ marginTop: 'var(--space-6)' }}>Séances</h2>
      {current.sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          exercisesById={byId}
          onEditSession={() => setSheet({ kind: 'session', sessionId: session.id })}
          onAddExercise={() => setSheet({ kind: 'exercise', sessionId: session.id })}
          onEditExercise={(plannedId) => setSheet({ kind: 'exercise', sessionId: session.id, plannedId })}
          onMoveExercise={(plannedId, direction) => saveSession(movePlannedExercise(session, plannedId, direction))}
        />
      ))}
      <Button variant="primary" fullWidth onClick={() => save(addSession(current, createSession(current, createId())))}>
        + Séance
      </Button>
      <DeleteProgramButton programId={current.id} mainProgramId={mainProgramId} onDelete={deleteProgram} />
      {sheet && (
        <ProgramSheets
          sheet={sheet}
          program={current}
          exercisesById={byId}
          onSaveSession={saveSession}
          onMoveSession={(sessionId, direction) => save(moveSession(current, sessionId, direction))}
          onDeleteSession={(sessionId) => {
            setSheet(null);
            save(removeSession(current, sessionId));
          }}
          onClose={() => setSheet(null)}
        />
      )}
    </section>
  );
}
