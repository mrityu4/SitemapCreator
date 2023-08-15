import { openDB, DBSchema, IDBPDatabase } from "idb";
import { colors, wframes } from "./assets/constants/contants";
type PageData = {
  name: string;
  key: string;
  Children: string[];
};

type PageBlocks = {
  key: string;
  blocks: {
    name: string;
    key: string;
    color: typeof colors[number];
    wframe: keyof typeof wframes | undefined;
  }[];
};
const siteStore = "siteStore";
const pageStore = "pageStore";
const dbName = "exampleDB";

interface PageDB extends DBSchema {
  siteStore: {
    key: string;
    value: {
      [key: string]: PageData;
    };
  };
  pageStore: {
    key: string;
    value: PageBlocks;
  };
}
async function openDatabase(): Promise<IDBPDatabase<PageDB>> {
  return await openDB<PageDB>(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(siteStore, {
        autoIncrement: false,
      });
      db.createObjectStore(pageStore, {
        autoIncrement: false,
      });
    },
  });
}

export async function storePage(value: PageData): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(siteStore, "readwrite");
  const store = tx.objectStore(siteStore);
  const { key } = value;
  console.log(value);
  let pageData = await store.get("pageData");
  if (!pageData) pageData = { [key]: value };
  else pageData[key] = value;
  await store.put(pageData, "pageData");
  await tx.done;
}

export async function storePageBlocks(value: PageBlocks): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(pageStore, "readwrite");
  const store = tx.objectStore(pageStore);
  const { key } = value;
  await store.put(value, key);
  await tx.done;
}

export async function getPageBlocks(
  key: string
): Promise<PageBlocks | undefined> {
  // console.log(key);
  const db = await openDatabase();
  const tx = db.transaction(pageStore, "readwrite");
  const store = tx.objectStore(pageStore);
  let pageBlocks = await store.get(key);
  await tx.done;
  return pageBlocks;
}

export async function getSitePages(): Promise<
  { [key: string]: PageData } | undefined
> {
  const db = await openDatabase();
  const tx = db.transaction(siteStore, "readwrite");
  const store = tx.objectStore(siteStore);
  let pageData = await store.get("pageData");
  await tx.done;
  return pageData;
}

// export async function editData(key: string, newMessage: string): Promise<void> {
//   const db = await openDatabase();
//   const tx = db.transaction(storeName, "readwrite");
//   const store = tx.objectStore(storeName);
//   const record = await store.get(key);

//   if (record) {
//     record.value.message = newMessage;
//     await store.put(record);
//     await tx.done;
//     console.log("Data updated:", record);
//   } else {
//     console.log(`No record found with key "${key}"`);
//   }
// }

// export async function deleteData(key: string): Promise<void> {
//   const db = await openDatabase();
//   const tx = db.transaction(storeName, "readwrite");
//   const store = tx.objectStore(storeName);
//   await store.delete(key);
//   await tx.done;
//   console.log(`Data deleted with key "${key}"`);
// }
