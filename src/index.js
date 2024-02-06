import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// import i18n (needs to be bundled ;))
import "./i18n";

// app pages
import LastPlayedGamesPage from "./last-played-games-page/LastPlayedGamesPage";
import ProjectsPage from "./projects-page/ProjectsPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      // errorElement: <ErrorPage />,
      children: [
        {
          path: "projects",
          element: <ProjectsPage />,
        },
        {
          path: "last-played-games",
          element: <LastPlayedGamesPage />,
        },
      ],
    },
  ],
  { basename: "/website" }
);

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
