import { InputText } from 'primereact/inputtext';
import React from 'react';

interface InputProps {
  label: string;
  name: string;
  validation: {
    values: Record<string, any>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
  type?: string;
  placeholder?: string;
  style: string;
}

const InputForm: React.FC<InputProps> = ({
  label,
  name,
  validation,
  type,
  placeholder,
  style,
}: any) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold">{label}</label>
      <InputText
        name={name}
        type={type}
        value={validation.values[name]}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
        placeholder={placeholder}
        className={`p-2 border border-solid ${style}`}
      />

      {validation.errors[name] && validation.touched[name] && (
        <p className="text-sm text-red-500">{validation.errors[name]}</p>
      )}
    </div>
  );
};

export default InputForm;
