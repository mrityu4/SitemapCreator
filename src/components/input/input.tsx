import React from "react";

function Input({
  defaultValue,
  onChange,
  disabled = false,
}: {
  defaultValue: string;
  onChange: (newName: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <input
        defaultValue={defaultValue}
        className="text-justify bg-transparent border-none selection:backdrop-brightness-110 focus-visible:outline-none focus-visible:border-none"
        // value={value}
        // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        //   onChange(e.target.value)
        // }
        onBlur={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

export default Input;
