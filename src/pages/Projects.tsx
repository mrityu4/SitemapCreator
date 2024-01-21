import React from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import tickIcon from "../assets/imgs/tick.svg";
import { usePocket } from "../contexts/PocketContext";
import { deleteDataBase } from "../store";
import logoutImg from "./../assets/imgs/logout.svg";

type Project = {
  name: string | null;
  id: string | null;
};

export const Projects: React.FC = () => {
  const { user, logout, createNewProject } = usePocket()!;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [creatingNewProject, setCreatingNewProject] = React.useState(false);
  const projects: Project[] = user?.projects ?? [];
  const navigate = useNavigate();

  const submitNewProjectReq = async (projectName: string | undefined) => {
    if (!projectName) return;
    const project = await createNewProject(projectName);
    deleteDataBase();
    navigate(`/edit/${project.id}`);
  };

  const handleCreatingNewProject = () => {
    flushSync(() => {
      setCreatingNewProject(true);
    });
    inputRef.current?.select();
  };

  return (
    <div className="pt-10">
      <div className="absolute top-2 right-2">
        <button title="Logout" onClick={logout} className="w-8 h-8">
          <img src={logoutImg} alt="Logout" />
        </button>
      </div>
      {projects.length > 0 && (
        <div className="flex flex-col items-center pb-6">
          <h2 className="pb-6">Select a project to start</h2>
          {projects?.map((p) => (
            <button
              onClick={() => navigate(`/edit/${p.id}`)}
              key={p.id}
              className="block px-1 py-1 mb-2 w-72 font-bold text-white bg-gray-500 rounded-3xl"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
      {creatingNewProject ? (
        <>
          <input ref={inputRef} placeholder="Project Name..." />
          <button
            className="w-8 h-8"
            onClick={() => submitNewProjectReq(inputRef.current?.value)}
          >
            <img src={tickIcon} alt="tick" />
          </button>
        </>
      ) : (
        <button onClick={handleCreatingNewProject}>
          {`${
            projects.length > 0
              ? "or Start with a new one"
              : "Start with a new One"
          }`}
        </button>
      )}
    </div>
  );
};
