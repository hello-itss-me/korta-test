import React from 'react';

    interface FormFieldProps {
      label: string;
      type: string;
      name: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      placeholder?: string;
      disabled?: boolean;
    }

    export function FormField({ 
      label, 
      type, 
      name, 
      value, 
      onChange, 
      placeholder, 
      disabled 
    }: FormFieldProps) {
      return (
        <div className="mobile-input-group">
          <label className="mobile-label">{label}</label>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`mobile-input ${disabled ? 'bg-gray-50' : ''} border border-gray-300`} // Added border here
          />
        </div>
      );
    }
