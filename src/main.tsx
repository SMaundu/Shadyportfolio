import { createRoot } from "react-dom/client";
import "@fontsource/anton/latin-400.css";
import "@fontsource-variable/manrope/wght.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
