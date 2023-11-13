import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import gdLogo from "/img/logo.png";
import IconButton from "../components/IconButton";
import { useContext, useEffect, useRef, useState } from "react";
import useQuery from "../lib/hooks/use-query";
import Alerts from "../lib/alerts";
import Auth from "../lib/http/auth";
import useMounted from "../lib/hooks/use-mounted";
import { useNavigate } from "react-router-dom";
import AppContext from "../contexts/AppContext";

export default function SignIn() {
  const effectRan = useRef(false);
  const { isMounted, unMount } = useMounted();
  const [isSubmitting, setSubmitting] = useState(false);
  const navigateTo = useNavigate();
  const { user, setAppUser } = useContext(AppContext);

  useEffect(() => {
    // check if there is a session and redirect user
    if (user && user.code) {
      navigateTo("dash");
    }

    const query = useQuery();
    const code = query.get("code");
    // fetch token only on the first render during development
    if (!effectRan.current && code != null) {
      requestAuthorization(code);
    }

    // setup flag so app doesn't make double request for authorization using
    // the same authorization code during development
    return () => {
      // update the ref and unmount component
      effectRan.current = true;
      unMount();
    };
  }, []);

  async function requestAuthorization(authCode) {
    try {
      setSubmitting(true);
      const userData = await Auth.getAccessToken(authCode);

      // set the user
      setAppUser({
        ...userData,
        code: authCode,
      });
      navigateTo("dash");
    } catch (error) {
      Alerts.showError(error.message);
    } finally {
      isMounted && setSubmitting(false);
    }
  }

  /**
   * Forwards the user to the GitHub login page for authorization.
   * The request responds with an authorization code once the user
   * approves the access request.
   */
  function forwardUserToGitHub() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user%20repo`
    );
  }

  return (
    <div className="vh-100 p-5">
      <main className="h-100 row align-items-stretch rounded flash-card">
        <section className="col d-flex align-items-center px-5 text-light d-none d-lg-flex">
          <div>
            <h1>Welcome to GitDeck</h1>
            <p className="fs-5">
              A dashboad tool to monitor your GitHub repositories.
            </p>
          </div>
        </section>

        <section className="col d-flex justify-content-center align-items-center px-5 bg-white rounded">
          <div>
            <div
              className="m-auto mb-3"
              style={{
                maxWidth: "6em",
              }}
            >
              <img src={gdLogo} alt="organization logo" className="img-fluid" />
            </div>

            <p className="fs-6 fw-medium text-center m-0 mb-1">
              You need a GitHub account to access your dashboard.
            </p>

            <div className="d-grid px-5">
              <IconButton
                btnText="Continue with GitHub"
                icon={faGithubAlt}
                className="btn-dark btn-lg"
                isLoading={isSubmitting}
                onClick={forwardUserToGitHub}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
