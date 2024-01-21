import React from "react";
import { colors, wframes } from "../../assets/constants/contants";
import { ReactComponent as AddBlock } from "../../assets/imgs/addBlock.svg";
import { ReactComponent as AddIcon } from "../../assets/imgs/addIcon.svg";
import { ReactComponent as OpenIcon } from "../../assets/imgs/open.svg";
import { getPageBlocks, storePageBlocks } from "../../store";
import Input from "../input/input";

import BlockComponent from "../Block/Block";
import Button from "../Button/Button";
type Block = {
  name: string;
  key: string;
  color: (typeof colors)[number];
  wframe: keyof typeof wframes | undefined;
};
type Blocks = Block[];

function Page({
  pagekey,
  name,
  parentKey,
  updatePage,
  onPageAdd,
  collapsed,
  toggleCollapse,
  hasChild,
}: {
  pagekey: string;
  name: string;
  parentKey: string;
  collapsed: Boolean;
  hasChild: Boolean;
  updatePage: (newName: string, key: string) => void;
  onPageAdd: (parentKey: string) => void;
  toggleCollapse: () => void;
}) {
  if (!pagekey) return null;
  const [blocks, setBlocks] = React.useState<Blocks>();
  const [isMouseOver, setIsMouseOver] = React.useState(false);

  React.useEffect(() => {
    const readPageBlocks = async () => {
      const storedPageBlocks = await getPageBlocks(pagekey);
      if (storedPageBlocks) setBlocks(storedPageBlocks?.blocks);
    };
    readPageBlocks();
  }, []);

  const onBlockAdd = () => {
    const newBlock: Block = {
      name: "",
      key: crypto.randomUUID(),
      color: "#2A2E45",
      wframe: "img1",
    };
    let pageBlocks: Blocks = [];
    if (blocks?.length) {
      pageBlocks = [...blocks];
    }
    pageBlocks.push(newBlock);

    storePageBlocks({
      key: pagekey,
      blocks: pageBlocks,
    });
    setBlocks(pageBlocks);
  };

  const onBlockChange = (modifiedBlock: Block) => {
    if (blocks?.length) {
      const index = blocks.findIndex((item) => item.key === modifiedBlock.key);
      if (index !== -1) {
        const newBlocks = [
          ...blocks.slice(0, index),
          modifiedBlock,
          ...blocks.slice(index + 1),
        ];
        storePageBlocks({
          key: pagekey,
          blocks: newBlocks,
        });
        setBlocks(newBlocks);
      }
    }
  };

  const deleteBlock = (key: string) => {
    if (blocks?.length) {
      const newBlocks = blocks.filter((b) => b.key !== key);
      storePageBlocks({
        key: pagekey,
        blocks: newBlocks,
      });
      setBlocks(newBlocks);
    }
  };

  const duplicateBlock = (key: string) => {
    if (blocks?.length) {
      const index = blocks.findIndex((b) => b.key === key);
      if (index !== -1) {
        const newBlock: Block = {
          ...blocks[index],
          key: crypto.randomUUID(),
        };

        const newBlocks = [
          ...blocks.slice(0, index + 1),
          newBlock,
          ...blocks.slice(index + 1),
        ];

        storePageBlocks({
          key: pagekey,
          blocks: newBlocks,
        });
        setBlocks(newBlocks);
      }
    }
  };
  return (
    <div
      className="relative p-2 pb-3 mx-auto w-36 rounded-lg border-2 border-teal-600"
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <Input
        defaultValue={name}
        onChange={(newName) => updatePage(newName, pagekey)}
      />
      {blocks?.map((b) => (
        <BlockComponent
          key={b.key}
          onBlockAdd={onBlockAdd}
          data={b}
          duplicateBlock={duplicateBlock}
          deleteBlock={deleteBlock}
          onBlockChange={onBlockChange}
        />
      ))}
      {!blocks?.length && (
        <div
          className={`h-5 w-full cursor-pointer rounded-md flex justify-center bg-green-400/[0.2] ${
            isMouseOver ? "" : "invisible"
          }`}
          onClick={onBlockAdd}
        >
          <Button
            className={`right-14`}
            onClick={() => {}}
            Icon={<AddBlock className="w-5 h-5" />}
          />
        </div>
      )}
      {pagekey !== "homepage" && (
        <Button
          className={`-right-4 top-4 ${isMouseOver ? "" : "hidden"}`}
          onClick={() => onPageAdd(parentKey)}
          Icon={<AddIcon className="w-5 h-5" />}
        />
      )}
      {hasChild && (
        <Button
          className={`-bottom-3 left-[-15px] ${
            isMouseOver || collapsed ? "" : "hidden"
          }`}
          onClick={toggleCollapse}
          Icon={
            <OpenIcon className={`w-5 h-5 ${!collapsed && "rotate-180"}`} />
          }
        />
      )}
      <Button
        className={`left-[55px] bottom-[-12px] ${isMouseOver ? "" : "hidden"}`}
        onClick={() => onPageAdd(pagekey)}
        Icon={<AddIcon className="w-5 h-5" />}
      />
    </div>
  );
}

export default Page;
