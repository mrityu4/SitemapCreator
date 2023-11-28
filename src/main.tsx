import { BrowserRouter, Route, Routes } from "react-router-dom";

import ReactDOM from "react-dom/client";
import SiteMapApp from "./App";
import { RequireAuth } from "./components/RequireAuth";
import { PocketProvider } from "./contexts/PocketContext";
import "./index.css";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

export const App = () => {
  console.log("hete");
  return (
    <PocketProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<SiteMapApp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PocketProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
