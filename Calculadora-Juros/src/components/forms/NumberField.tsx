type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
};

export function NumberField({ label, value, onChange, step = 1, min = 0, max, suffix }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="field__compound">
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          min={min}
          max={max}
          step={step}
          className="field__input"
        />
        {suffix ? <span className="field__suffix">{suffix}</span> : null}
      </div>
    </label>
  );
}
