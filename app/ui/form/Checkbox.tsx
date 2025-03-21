import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import { Controller } from 'react-hook-form';

interface Props {
  label: string;
  name: string;
  control: any;
  required?: boolean;
  errors: Record<string, any>;
  defaultChecked?: boolean;
}

export default function Checkbox({
  label,
  name,
  control,
  required = false,
  errors,
  defaultChecked = false,
}: Props) {
  return (
    <div>
      {/* <label htmlFor={name} style={{ display: 'block', marginBottom: '8px' }}>
        {label}
      </label> */}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultChecked}
        rules={{ required: required && `${label} est requis` }}
        render={({ field }) => (
          <AntCheckbox {...field} checked={field.value}>
            {label}
          </AntCheckbox>
        )}
      />
      {errors[name] && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {errors[name]?.message}
        </div>
      )}
    </div>
  );
}
