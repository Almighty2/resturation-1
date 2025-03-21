import React from 'react';
import { Input as AntInput } from 'antd';
import { Controller } from 'react-hook-form';

interface Props {
  label: string;
  name: string;
  control: any;
  required?: boolean;
  errors: Record<string, any>;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
}

export default function Input({
  label,
  name,
  control,
  required = false,
  errors,
  placeholder = `Entrez votre ${label.toLowerCase()}`,
  type = "text",
  defaultValue = "",
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required }}
        render={({ field }) => (
          <AntInput
            {...field}
            type={type}
            placeholder={placeholder}
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