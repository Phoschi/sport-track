import type { IsoDayOfWeek } from '../../../shared/domain/parisDate';
import type { ChipOption } from '../../../shared/ui/ChipGroup';

export const DAY_NAMES: Record<IsoDayOfWeek, string> = {
  1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 7: 'Dimanche',
};

export const DAY_CHIPS: readonly ChipOption<IsoDayOfWeek>[] = (
  [1, 2, 3, 4, 5, 6, 7] as const
).map((day) => ({ value: day, label: DAY_NAMES[day].slice(0, 2) }));
