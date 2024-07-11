import React from "react";

const TextInput = React.forwardRef(
  (
    {
      type,
      placeholder,
      styles,
      label,
      labelStyles,
      register,
      name,
      error,
      containerStyle = "",
    },
    ref
  ) => {
    return (
      <div className={`w-full flex flex-col ${containerStyle}`}>
        {label && (
          <p className={`text-ascent-2 text-sm  mb-1 ${labelStyles}`}>
            {label}
          </p>
        )}
        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            className={`bg-secondary rounded-lg border' border-[#66666690] outline-none text-xl max-sm:text-sm
               text-ascent-1 max-md:py-2 px-4 py-3 placeholder:text-[#666] ${styles}`}
            {...register}
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

export default TextInput;
