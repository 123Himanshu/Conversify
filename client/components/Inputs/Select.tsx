import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  disabled?: boolean;
  options: Record<string, any>[];
  onChange: (value: Record<string, any>) => void;
  value: Record<string, any>;
}

const Select: React.FC<SelectProps> = ({
  label,
  disabled,
  onChange,
  options,
  value,
}) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#031526",
      fontSize: "0.875rem",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#031526",
      color: "#8CA1BB",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#0D2136" : null,
      "&:hover": {
        backgroundColor: "#0D2136",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#06192A",
      color: "#e5e7eb",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#e5e7eb",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#e5e7eb",
      "&:hover": {
        backgroundColor: "#2C5282",
        color: "#e5e7eb",
      },
    }),
  };

  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-accent-1">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={customStyles}
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
};

export default Select;
