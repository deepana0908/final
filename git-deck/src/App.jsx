import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import SignIn from "./routes/signin";
import Overview from "./routes/overview";
import Reposiroties from "./routes/repositories";
import Organizations from "./routes/organizations";
import Dashboard from "./routes/dashboard";
import Constants from "./lib/constants";
import AppContext from "./contexts/AppContext";
import ErrorPage from "./routes/error";
import Auth from "./lib/http/auth";
import Alerts from "./lib/alerts";

// declare our app routes
const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },
  {
    // our dash is a nested root element for authenticated users
    path: "/dash",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "repos",
        element: <Reposiroties />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
    ],
  },
]);

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isReposLoading, setReposLoading] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem(Constants.STORAGE_ID));
    if (localUser) {
      // check if user has an active access token in the backend
      Auth.checkAuth(localUser.code)
        .then((data) => {
          // new data for the local storage
          const userData = {
            username: data["username"],
            name: data["name"],
            avatarUrl: data["avatarUrl"],
            followers: data["followers"],
            following: data["following"],
            bio: data["bio"],
            code: localUser.code,
          };

          setAppUser(userData);
        })
        .catch((err) => {
          Alerts.showError(err.message)
        }).finally(() => setAuthenticating(false));
    }
  });

  function setAppUser(userData) {
    // and localstorage for session persistence
    localStorage.setItem(Constants.STORAGE_ID, JSON.stringify(userData));
    // update context for UI updates
    setUser(userData);
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setAppUser,
        repos,
        setRepos,
        isReposLoading,
        setReposLoading,
      }}
    >
      <Toaster />
      {isAuthenticating || (<RouterProvider router={appRoutes} />)}
    </AppContext.Provider>
  );
}

export default App;
