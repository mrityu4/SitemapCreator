import React from "react";
import { TreeNode } from "react-organizational-chart";
import Page from "../Page/Page";
import { useTreeContext } from "../../App";

function SubTree({ parentKey }: { parentKey: string }) {
  const [collapsedPages, setCollapsedPages] = React.useState<string[]>([]);

  const onToggleCollapse = (key: string) => {
    if (collapsedPages.includes(key))
      setCollapsedPages(collapsedPages.filter((k) => k !== key));
    else setCollapsedPages([...collapsedPages, key]);
  };

  const editorContext = useTreeContext();
  const { pages, onPageAdd, onPageChange } = editorContext;
  if (pages?.[parentKey] && pages?.[parentKey]?.Children.length) {
    return (
      <>
        {pages?.[parentKey]?.Children.map((child) => {
          const renderSubTree =
            collapsedPages.includes(pages?.[child].key) ||
            !pages?.[child]?.Children.length;

          return (
            <TreeNode
              label={
                <Page
                  key={pages?.[child].key}
                  pagekey={pages?.[child].key}
                  name={pages?.[child].name as string}
                  updatePage={onPageChange}
                  parentKey={parentKey}
                  onPageAdd={onPageAdd}
                  toggleCollapse={() => onToggleCollapse(pages?.[child].key)}
                  collapsed={collapsedPages.includes(pages?.[child].key)}
                  hasChild={pages[child].Children.length > 0}
                />
              }
            >
              {renderSubTree ? null : <SubTree parentKey={child} />}
            </TreeNode>
          );
        })}
      </>
    );
  } else return null;
}

export default SubTree;
