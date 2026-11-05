import styles from './Stepper.module.css';

type StepperProps = { value: number; min: number; max: number; label: string; onChange: (value: number) => void };

export function Stepper({ value, min, max, label, onChange }: StepperProps) {
  return (
    <div className={styles.stepper} role="group" aria-label={label}>
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="Moins">
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="Plus">
        +
      </button>
    </div>
  );
}
