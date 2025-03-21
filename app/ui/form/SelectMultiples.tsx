import React from "react";
import { Select as AntSelect } from "antd";
import { Controller } from "react-hook-form";

// Interface pour le format des options
interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  control: any;
  required?: boolean;
  errors: Record<string, any>;
  options: SelectOption[];
  placeholder?: string;
}

export default function MultiSelect({
  label,
  name,
  control,
  required = false,
  errors,
  options,
  placeholder = "Sélectionnez des options",
}: Props) {
  // Fonction pour trouver le label correspondant à une valeur
  const getLabelByValue = (value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        rules={{ required }}
        render={({ field }) => {
          const selectedValues: string[] = field.value || [];
          
          return (
            <AntSelect
              {...field}
              mode="multiple"
              style={{ width: "100%" }}
              placeholder={placeholder}
              options={options}
              status={errors[name] ? "error" : ""}
              value={selectedValues}
              onChange={(values) => field.onChange(values)}
              className={`w-full rounded-lg transition-all duration-300 ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
              labelInValue={false}
              optionFilterProp="label"
              optionLabelProp="label"
            />
          );
        }}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">Ce champ est requis.</p>}
    </div>
  );
}