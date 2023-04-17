import React from "react";
import deleteIcon from "../../assets/imgs/delete.svg";
import duplicateIcon from "../../assets/imgs/duplicate.svg";
import wireframeIcon from "../../assets/imgs/wireframe.svg";
import blockadd from "../../assets/imgs/blockadd.svg";
import { ReactComponent as Circle } from "../../assets/imgs/circle.svg";
import useModalOutsideClick from "../../hooks/useModalOutsideClick";
import { colors, wframes } from "../../assets/constants/contants";
type Block = {
  name: string;
  key: string;
  color: typeof colors[number];
  wframe: keyof typeof wframes | undefined;
};

function ConfigBox({
  onBlockAdd,
  onBlockChange,
  data,
  deleteBlock,
  duplicateBlock,
}: {
  onBlockAdd: (k: string) => void;
  deleteBlock: (k: string) => void;
  duplicateBlock: (k: string) => void;
  onBlockChange: (modifiedBlock: Block) => void;
  data: Block;
}) {
  const [color, setColor] = React.useState<typeof colors[number]>(data.color);
  const [frame, setFrame] = React.useState<keyof typeof wframes | undefined>(
    data.wframe
  );
  const [iscolorPickerOpen, colorPickerRef, handleColorPicker] =
    useModalOutsideClick<HTMLDivElement>();

  const [isFramePickerOpen, framePickerRef, handleFramePicker] =
    useModalOutsideClick<HTMLDivElement>();

  function handleColorChange(c: typeof colors[number]) {
    setColor(c);
    onBlockChange({ ...data, color: c });
    handleColorPicker(false);
  }
  function handleFrameChange(c: keyof typeof wframes) {
    setFrame(c);
    onBlockChange({ ...data, wframe: c });
    handleFramePicker(false);
  }

  return (
    <div>
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        className="absolute flex items-center p-2 px-3 bg-gray-600 -bottom-1 rounded-3xl"
      >
        <button className="w-12 h-12" onClick={() => duplicateBlock(data.key)}>
          <img src={duplicateIcon} alt="duplicate" />
        </button>
        <button style={{ color }} onClick={() => handleColorPicker(true)}>
          <Circle className="w-8 h-8" />
        </button>
        <button className="w-12 h-12" onClick={() => onBlockAdd(data.key)}>
          <img src={blockadd} alt="add block" />
        </button>
        <button className="w-12 h-12" onClick={() => handleFramePicker(true)}>
          <img src={wireframeIcon} alt="wireframe" />
        </button>
        <button className="w-12 h-12" onClick={() => deleteBlock(data.key)}>
          <img src={deleteIcon} alt="delete block" />
        </button>
      </div>
      {iscolorPickerOpen && (
        <div
          ref={colorPickerRef}
          className="absolute z-10 flex flex-wrap justify-start w-32 bg-gray-600 rounded-xl"
        >
          {colors.map((c) => (
            <button
              style={{ color: `${c}` }}
              onClick={() => handleColorChange(c)}
            >
              <Circle className="w-8 h-8" />
            </button>
          ))}
        </div>
      )}
      {isFramePickerOpen && (
        <div
          ref={framePickerRef}
          className="absolute z-10 flex flex-wrap justify-start w-48 bg-gray-600 rounded-xl"
        >
          {Object.entries(wframes).map(([key, val]) => (
            <button
              className="w-16 h-8"
              onClick={() => handleFrameChange(key as keyof typeof wframes)}
            >
              <img src={val} alt="add block" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConfigBox;
