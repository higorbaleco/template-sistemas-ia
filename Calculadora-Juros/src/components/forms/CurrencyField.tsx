import { formatCurrencyTyping } from "../../utils/formatters";

type CurrencyFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "numeric" | "decimal";
  placeholder?: string;
};

export function CurrencyField({ label, value, onChange, inputMode = "decimal", placeholder = "R$ 0,00" }: CurrencyFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(formatCurrencyTyping(event.target.value))}
        inputMode={inputMode}
        placeholder={placeholder}
        className="field__input"
      />
    </label>
  );
}
