import React from 'react';
import { Select as AntSelect } from 'antd';
import { Controller } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  control: any;
  required?: boolean;
  errors: Record<string, any>;
  options: Option[];
  placeholder?: string;
  showSearch?: boolean;
  defaultValue?: string;
}

export default function Select({
  label,
  name,
  control,
  required = false,
  errors,
  options,
  placeholder = "Sélectionnez une option",
  showSearch = true,
  defaultValue,
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ""}
        rules={{ required }}
        render={({ field }) => (
          <AntSelect
            {...field}
            showSearch={showSearch}
            style={{ width: '100%' }}
            placeholder={placeholder}
            optionFilterProp="label"
            filterSort={(optionA, optionB) => 
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={options}
            status={errors[name] ? "error" : ""}
            className={`w-full rounded-lg transition-all duration-300 ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
          />
        )}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">Ce champ est requis.</p>}
    </div>
  );
}