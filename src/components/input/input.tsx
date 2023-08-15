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
  const editableDivRef = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    if (editableDivRef.current) {
      editableDivRef.current.textContent = defaultValue;
    }
  }, [editableDivRef]);
  return (
    <div>
      <div
        ref={editableDivRef}
        contentEditable={!disabled}
        defaultValue={defaultValue}
        className="text-center text-sm h-auto p-0 m-0 w-full break-all bg-transparent border-none selection:backdrop-brightness-110 focus-visible:outline-none focus-visible:border-none"
        onInput={() => onChange(editableDivRef?.current?.textContent || "")}
      />
    </div>
  );
}

export default Input;
