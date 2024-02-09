import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// import i18n (needs to be bundled ;))
import "./i18n";

// app pages
import LastPlayedGamesPage from "./pages/last-played-games-page/LastPlayedGamesPage";
import ProjectsPage from "./pages/projects-page/ProjectsPage";
import ImpressumPage from "./pages/impressum-page/ImpressumPage";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate replace to="projects" />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "last-played-games",
        element: <LastPlayedGamesPage />,
      },
      {
        path: "impressum",
        element: <ImpressumPage />,
      },
    ],
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
