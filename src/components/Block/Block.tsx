import { colors, wframes } from "../../assets/constants/contants";
import useModalOutsideClick from "../../hooks/useModalOutsideClick";
import ConfigBox from "../ConfigBox";
import Input from "../input/input";

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
      className="relative my-2 rounded-lg"
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
          className="w-36 h-10"
          src={wframes[data.wframe]}
          alt="wireframe option"
        />
      )}
    </div>
  );
}

export default Block;
