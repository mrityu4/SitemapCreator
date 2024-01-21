import React from "react";
import { Tree } from "react-organizational-chart";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import logoutImg from "./assets/imgs/logout.svg";
import syncImg from "./assets/imgs/sync.svg";
import Page from "./components/Page/Page";
import SubTree from "./components/Tree/Tree";
import { usePocket } from "./contexts/PocketContext";
import {
  batchStorePage,
  batchStorePageBlocks,
  getSitePages,
  storePage,
} from "./store";

type PageData = {
  name: string;
  key: string;
  Children: string[];
};
const panSpeedX = -0.5;
const panSpeedY = -0.5;

type TreeContextType = {
  onPageAdd: (parentKey: string) => void;
  onPageChange: (newName: string, key: string) => void;
  pages: { [key: string]: PageData } | undefined;
};

const TreeContext = React.createContext<TreeContextType>({
  onPageAdd: () => {},
  onPageChange: () => {},
  pages: undefined,
});

export function useTreeContext() {
  const context = React.useContext(TreeContext);
  if (context === undefined) {
    throw new Error("useTreeContext must be used within a <Tree />");
  }
  return context;
}

function App() {
  let initialDistance: number = 1;
  let initialScale: number;
  let scale = 1;
  const { logout, syncProject, syncAndDeleteDb, fetchProjectData } =
    usePocket()!;

  const [pages, setPages] = React.useState<
    { [key: string]: PageData } | undefined
  >();
  const [collapsed, setCollapsed] = React.useState(false);
  const siteMapRef = React.createRef<HTMLDivElement>();

  const navigate = useNavigate();
  const { projectId } = useParams();

  React.useEffect(() => {
    const fetchAndSaveProject = async (projectId: string) => {
      let storedPages;
      storedPages = await fetchProjectData(projectId);
      if (storedPages.pageData) {
        await batchStorePageBlocks(Object.values(storedPages.pageData));
      }
      batchStorePage(Object.values(storedPages.siteData));
      setPages(storedPages.siteData);
    };

    if (projectId) fetchAndSaveProject(projectId);
    else navigate("/projects");

    // readPages();
  }, []);

  // csyncAndDeleteDbonst readPages = async () => {
  //   const storedPages = await getSitePages();
  //   if (!storedPages) {
  //     storePage({ name: "HomePage", key: "homepage", Children: [] });
  //     setPages({
  //       homepage: { name: "HomePage", key: "homepage", Children: [] },
  //     });
  //     return;
  //   }
  //   setPages(storedPages);
  // };

  React.useEffect(() => {
    if (!pages) return;
    const tree: HTMLElement | null = document.querySelector("#sitemap > ul");
    window.addEventListener("beforeunload", syncAndDeleteDb);
    document.getElementById("root")?.addEventListener("wheel", (e) => {
      // e.preventDefault();
      if (tree) {
        const newX = tree.offsetLeft + e.deltaX * panSpeedX;
        const newY = tree.offsetTop + e.deltaY * panSpeedY;

        tree.style.left = `${newX}px`;
        tree.style.top = `${newY}px`;
      }
    });

    setTimeout(() => {
      if (tree) {
        const initialLeftPos = (window.innerWidth - tree?.clientWidth) / 2;
        const initialTopPos = (window.innerHeight - tree?.clientHeight) / 2;
        tree.style.left = `${initialLeftPos}px`;
        tree.style.top = `${initialTopPos}px`;
      }
    }, 55);
    return () =>
      document.getElementById("root")?.removeEventListener("wheel", () => {});
  }, [Boolean(pages)]);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (event.touches.length === 2) {
      initialDistance = getDistance(event.touches[0], event.touches[1]);
      initialScale = scale;
      event.preventDefault();
    }
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (event.touches.length === 2) {
      const distance = getDistance(event.touches[0], event.touches[1]);
      scale = initialScale * (distance / initialDistance);

      if (siteMapRef.current) {
        siteMapRef.current.style.transform = `scale(${scale})`;
      }
      event.preventDefault();
    }
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (event.touches.length < 2) {
      initialDistance = 1;
    }
  };

  const onPageChange = (newName: string, key: string) => {
    const { Children } = pages?.[key] ?? { Children: [] };
    storePage({ name: newName, key, Children });
    const readPages = async () => {
      const storedPages = await getSitePages();
      setPages(storedPages);
    };
    readPages();
  };

  const onPageAdd = async (parentKey: string) => {
    const parentPage = pages?.[parentKey];
    if (!parentPage) return;
    const newPage = { name: "", key: crypto.randomUUID(), Children: [] };
    parentPage?.Children.push(newPage.key);
    await storePage(parentPage);
    await storePage(newPage);
    const readPages = async () => {
      const storedPages = await getSitePages();
      setPages(storedPages);
    };
    readPages();
  };

  if (!pages) return null;

  return (
    <>
      <div className="absolute top-2 right-2">
        <button title="Add Block" onClick={syncProject} className="w-8 h-8">
          <img src={syncImg} alt="add block" />
        </button>

        <button title="Logout" onClick={logout} className="w-8 h-8">
          <img src={logoutImg} alt="Logout" />
        </button>
      </div>
      <TreeContext.Provider value={{ pages, onPageAdd, onPageChange }}>
        <div
          id="sitemap"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={siteMapRef}
        >
          <Tree
            lineColor={"green"}
            label={
              <Page
                key="homepage"
                pagekey="homepage"
                name={pages?.["homepage"].name as string}
                updatePage={onPageChange}
                parentKey="homepage"
                onPageAdd={onPageAdd}
                toggleCollapse={() => setCollapsed((p) => !p)}
                collapsed={collapsed}
                hasChild={(pages?.["homepage"]?.Children?.length as number) > 0}
              />
            }
          >
            {collapsed || !pages?.["homepage"]?.Children.length ? null : (
              <SubTree parentKey="homepage" />
            )}
          </Tree>
        </div>
      </TreeContext.Provider>
    </>
  );
}

export default App;
