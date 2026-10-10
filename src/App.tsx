import { useEffect, useState } from "react";
import Home from "./Home";
import Admin from "./Admin";
import { track } from "./lib/track";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (path === "/") track("page_view", "home");
  }, [path]);

  return path.startsWith("/admin") ? <Admin /> : <Home />;
}
