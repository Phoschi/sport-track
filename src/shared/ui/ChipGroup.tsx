import styles from './ChipGroup.module.css';

export type ChipOption<T extends string | number> = { value: T; label: string };

type ChipGroupProps<T extends string | number> = {
  options: readonly ChipOption<T>[];
  selected: T | undefined;
  label: string;
  onSelect: (value: T) => void;
};

export function ChipGroup<T extends string | number>({ options, selected, label, onSelect }: ChipGroupProps<T>) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === selected}
          className={option.value === selected ? `${styles.chip} ${styles.selected}` : styles.chip}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
