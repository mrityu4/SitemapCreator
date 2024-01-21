import jwtDecode from "jwt-decode";
import PocketBase from "pocketbase";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useInterval } from "usehooks-ts";
import { colors, wframes } from "../assets/constants/contants";
import { deleteDataBase, getBlocksOfAllPages, getSitePages } from "../store";

const BASE_URL = "https://bright-lunch.pockethost.io/";
const fiveMinutesInMs = 5 * 60 * 1000;
const twoMinutesInMs = 2 * 60 * 1000;

type PageData = {
  name: string;
  key: string;
  Children: string[];
} | null;

type PageBlocks = {
  key: string;
  blocks: {
    name: string;
    key: string;
    color: (typeof colors)[number];
    wframe: keyof typeof wframes | undefined;
  }[];
} | null;

interface User {
  id: string;
  collectionId: string;
  collectionName: string;
  username: string;
  verified: boolean;
  emailVisibility: boolean;
  email: string;
  created: string;
  updated: string;
  name: string;
  avatar: string;
  projects: Project[];
}
type Project = { name: string | null; id: string | null };

type PocketContextProps = {
  register: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  createNewProject: (
    projectName: string
  ) => Promise<{ siteData: string; pageData: PageBlocks } & { id: string }>;
  fetchProjectData: (projectId: string) => Promise<any>;
  logout: () => void;
  syncProject: () => void;
  syncAndDeleteDb: () => void;
  setCurrentProject: React.Dispatch<React.SetStateAction<Project | undefined>>;
  user: User | null;
  token: string | null;
  pb: PocketBase;
  currentProject: Project;
};

const PocketContext = createContext<PocketContextProps | null>(null);

export const PocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState<User>(pb.authStore.model as unknown as User);
  const [currentProject, setCurrentProject] = useState<Project>();

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setCurrentProject(undefined);
      setToken(token);
      setUser(model as unknown as User);
    });
  }, []);

  useEffect(() => {
  }, [user]);

  const register = useCallback(async (email: string, password: string) => {
    return await pb
      .collection("users")
      .create({ email, password, passwordConfirm: password });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    setUser(authData.record as unknown as User);
    return authData;
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded: { exp: number } = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  const createNewProject = useCallback(
    async (projectName: string) => {
      //save in projects db
      const newProject: {
        siteData: string;
        pageData: PageBlocks;
        userid: string;
      } = {
        siteData: JSON.stringify({
          homepage: { name: "HomePage", key: "homepage", Children: [] },
        }),
        pageData: null,
        userid: user.id,
      };
      const record = await pb
        .collection("projectData")
        .create<typeof newProject & { id: string }>(newProject);

      const createdProject = { name: projectName, id: record.id };
      //
      setCurrentProject(createdProject);
      const projectList = user.projects ?? [];
      const newProjectList = [...projectList, createdProject];
      const updatedUserWithProject: User = {
        ...user,
        projects: newProjectList,
      };

      await pb.collection("users").update(user.id, updatedUserWithProject);
      setUser(updatedUserWithProject);
      return record;
    },
    [user]
  );

  const fetchProjectData = async (id: string) => {
    return await pb.collection("projectData").getOne(id);
  };

  const syncProject = async () => {
    const pageData = await getBlocksOfAllPages();
    const projectId = window.location.pathname.split("/")?.[2];
    const siteData = await getSitePages();
    const data = {
      siteData,
      pageData,
      userid: user.id,
    };

    const record = await pb.collection("projectData").update(projectId, data);
  };

  const syncAndDeleteDb = async () => {
    await syncProject();
    await deleteDataBase();
  };

  useInterval(
    syncProject,
    token && window.location.pathname.split("/").includes("edit")
      ? twoMinutesInMs
      : null
  );

  return (
    <PocketContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        token,
        pb,
        createNewProject,
        currentProject: currentProject!,
        fetchProjectData,
        syncProject,
        setCurrentProject,
        syncAndDeleteDb,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
