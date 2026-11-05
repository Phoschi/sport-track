import type { Direction } from '../../../shared/domain/swapAdjacent';
import { addPlannedExercise, removePlannedExercise, updatePlannedExercise } from '../domain/sessionEditing';
import type { Exercise, Program, SessionTemplate } from '../domain/types';
import { PlannedExerciseSheet } from './PlannedExerciseSheet';
import { SessionSheet } from './SessionSheet';

export type OpenSheet =
  | { kind: 'session'; sessionId: string }
  | { kind: 'exercise'; sessionId: string; plannedId?: string };

type ProgramSheetsProps = {
  sheet: OpenSheet;
  program: Program;
  exercisesById: ReadonlyMap<string, Exercise>;
  onSaveSession: (session: SessionTemplate) => void;
  onMoveSession: (sessionId: string, direction: Direction) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose: () => void;
};

export function ProgramSheets(props: ProgramSheetsProps) {
  const { sheet, program, exercisesById, onSaveSession, onMoveSession, onDeleteSession, onClose } = props;
  const index = program.sessions.findIndex((session) => session.id === sheet.sessionId);
  const session = program.sessions[index];
  if (!session) return null;

  if (sheet.kind === 'session') {
    return (
      <SessionSheet
        key={session.id}
        session={session}
        canMoveUp={index > 0}
        canMoveDown={index < program.sessions.length - 1}
        onChange={onSaveSession}
        onMove={(direction) => onMoveSession(session.id, direction)}
        onDelete={() => onDeleteSession(session.id)}
        onClose={onClose}
      />
    );
  }

  const plannedIndex = session.exercises.findIndex((planned) => planned.id === sheet.plannedId);
  const initial = session.exercises[plannedIndex];
  const isNew = initial === undefined;
  const previous = session.exercises.at(-1);
  // A new exercise is appended last: it can only be linked to the one above it.
  const supersetLabel = isNew
    ? previous && "Superset avec l'exo précédent"
    : plannedIndex < session.exercises.length - 1 ? "Superset avec l'exo suivant" : undefined;
  const supersetInitial = isNew ? false : initial.supersetWithNext;

  return (
    <PlannedExerciseSheet
      exercisesById={exercisesById}
      initial={initial}
      defaultRepRange={session.exercises.at(-1)?.repRange}
      supersetLabel={supersetLabel}
      supersetInitial={supersetInitial}
      onSave={(planned, superset) => {
        onSaveSession(isNew ? addPlannedExercise(session, planned, superset) : updatePlannedExercise(session, { ...planned, supersetWithNext: superset }));
        onClose();
      }}
      onRemove={isNew ? undefined : () => {
        onSaveSession(removePlannedExercise(session, initial.id));
        onClose();
      }}
      onClose={onClose}
    />
  );
}
