import React, { ReactNode } from "react";

function Button({
  onClick,
  Icon,
  className,
}: {
  onClick: () => void;
  Icon: ReactNode;
  className?: string | undefined;
}) {
  return (
    <button
      className={`absolute z-30 px-1 text-base ${className ?? ""}`}
      onClick={onClick}
    >
      {Icon}
    </button>
  );
}

export default Button;
