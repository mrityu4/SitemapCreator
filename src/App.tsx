import React from "react";
import "./App.css";
import { storePage, getSitePages } from "./store";
import Page from "./components/Page/Page";
type PageData = { name: string; key: string; Children: string[] };

function App() {
  const [pages, setPages] = React.useState<
    { [key: string]: PageData } | undefined
  >();

  React.useEffect(() => {
    storePage({ name: "HomePage", key: "homepage", Children: [] });

    const readPages = async () => {
      const storedPages = await getSitePages();
      setPages(storedPages);
      console.log(storedPages && Object.keys(storedPages));
    };
    readPages();
  }, []);

  React.useEffect(() => {
    console.log(!!pages);
  }, [pages]);

  const onPageChange = (newName: string, key: string) => {
    const { Children } = pages?.[key] ?? { Children: [] };
    console.log("called");
    storePage({ name: newName, key, Children });
    const readPages = async () => {
      const storedPages = await getSitePages();
      setPages(storedPages);
    };
    readPages();
  };

  return (
    <div>
      {pages &&
        Object.keys(pages)?.map((p) => (
          <Page
            key={p}
            pagekey={p}
            name={pages[p].name}
            updatePage={onPageChange}
          />
        ))}
      {/* <Page key="homepage" /> */}
    </div>
  );
}

export default App;
