/** The main program must be replaced before it can be deleted. */
export function canDeleteProgram(programId: string, mainProgramId: string | undefined): boolean {
  return programId !== mainProgramId;
}
