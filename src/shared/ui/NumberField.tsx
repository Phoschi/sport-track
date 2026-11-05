import { useEffect, useState, type InputHTMLAttributes } from 'react';
import { formatDecimal, parseDecimal } from '../domain/formatNumber';

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: number | null;
  onValueChange: (value: number | null) => void;
};

const toText = (value: number | null) => (value === null ? '' : formatDecimal(value));

/** Keeps the typed text (e.g. "17,") while exposing a parsed number; null when empty or invalid. */
export function NumberField({ value, onValueChange, ...inputProps }: NumberFieldProps) {
  const [text, setText] = useState(toText(value));

  useEffect(() => {
    // Only resync when the value changed from outside, not while the user is typing it.
    setText((current) => (parseDecimal(current) === value ? current : toText(value)));
  }, [value]);

  return (
    <input
      {...inputProps}
      value={text}
      autoComplete="off"
      onChange={(event) => {
        setText(event.target.value);
        onValueChange(parseDecimal(event.target.value));
      }}
    />
  );
}
