// Dans votre fichier SelectMultiples.tsx

import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import ReactSelect from "react-select"; // Supposons que vous utilisez react-select

interface PlanningOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  control: Control;
  required: boolean;
  errors: FieldErrors;
  options: PlanningOption[];
  placeholder: string;
  defaultValue?: string[] | undefined;
}

const MultiSelect = ({
  label,
  name,
  control,
  required,
  errors,
  options,
  placeholder,
  defaultValue
}: Props) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || []}
        rules={{ required: required ? "Ce champ est requis" : false }}
        render={({ field }) => (
          <ReactSelect
            {...field}
            isMulti
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder={placeholder}
            menuIsOpen={field.isFocused} // Ouvre automatiquement le menu au focus
            onFocus={() => {
              // Force l'ouverture du menu au focus
              field.onBlur(); // Nécessaire pour gérer correctement le état
              field.onFocus();
            }}
            // Configuration pour montrer tous les éléments sans filtrage
            filterOption={() => true}
            // Ou alternativement, désactiver le filtrage
            // isSearchable={false}
          />
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;