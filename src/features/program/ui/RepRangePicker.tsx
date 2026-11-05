import { ChipGroup } from '../../../shared/ui/ChipGroup';

const PRESETS = ['4-6', '6-8', '8-10', '8-12', '10-12', '12-15'] as const;
const PRESET_CHIPS = PRESETS.map((preset) => ({ value: preset as string, label: preset }));

type RepRangePickerProps = { value: string; onChange: (value: string) => void };

export function RepRangePicker({ value, onChange }: RepRangePickerProps) {
  return (
    <>
      <ChipGroup label="Fourchette de reps" options={PRESET_CHIPS} selected={value} onSelect={onChange} />
      <label>
        Ou saisie libre (ex. 8 ou 4-6)
        <input value={value} autoComplete="off" onChange={(event) => onChange(event.target.value)} />
      </label>
    </>
  );
}
