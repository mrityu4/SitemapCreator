import React from "react";
import Input from "../input/input";
import ConfigBox from "../ConfigBox";
import useModalOutsideClick from "../../hooks/useModalOutsideClick";
import { colors, wframes } from "../../assets/constants/contants";
type Block = {
  name: string;
  key: string;
  color: typeof colors[number];
  wframe: keyof typeof wframes | undefined;
};

function Block({
  onBlockAdd,
  data,
  onBlockChange,
  duplicateBlock,
  deleteBlock,
}: {
  onBlockAdd: (k: string) => void;
  deleteBlock: (k: string) => void;
  duplicateBlock: (k: string) => void;
  onBlockChange: (modifiedBlock: Block) => void;
  data: Block;
}) {
  const [isConfigBoxOpen, blockRef, handleConfigBox] =
    useModalOutsideClick<HTMLDivElement>();

  return (
    <div
      ref={blockRef}
      className="relative rounded-lg my-2"
      style={{ backgroundColor: data.color }}
      onClick={() => handleConfigBox(true)}
    >
      {isConfigBoxOpen && (
        <ConfigBox
          onBlockAdd={onBlockAdd}
          onBlockChange={onBlockChange}
          data={data}
          deleteBlock={deleteBlock}
          duplicateBlock={duplicateBlock}
        />
      )}
      <Input
        defaultValue={data.name}
        onChange={(newName) => onBlockChange({ ...data, name: newName })}
      />
      {data.wframe && (
        <img
          className="h-10 w-36"
          src={wframes[data.wframe]}
          alt="wireframe option"
        />
      )}
    </div>
  );
}

export default Block;
