import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import type { Program } from '../domain/types';
import programStyles from './program.module.css';

type ProgramHeaderProps = {
  program: Program;
  mainProgramId: string | undefined;
  onRename: (name: string) => void;
  onSetMain: () => void;
};

export function ProgramHeader({ program, mainProgramId, onRename, onSetMain }: ProgramHeaderProps) {
  const [name, setName] = useState(program.name);
  const isMain = program.id === mainProgramId;

  function commitName() {
    const trimmed = name.trim();
    if (trimmed === '') setName(program.name);
    else if (trimmed !== program.name) onRename(trimmed);
  }

  return (
    <header className={programStyles.stack}>
      <label>
        Nom du programme
        <input value={name} onChange={(event) => setName(event.target.value)} onBlur={commitName} />
      </label>
      {isMain ? (
        <p className={programStyles.badge}>★ Programme principal</p>
      ) : (
        <Button fullWidth onClick={onSetMain}>★ Définir comme principal</Button>
      )}
    </header>
  );
}
