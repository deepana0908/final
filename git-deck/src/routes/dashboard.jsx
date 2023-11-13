import { Outlet, useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import { useContext, useEffect } from "react";
import AppContext from "../contexts/AppContext";
import Alerts from "../lib/alerts";
import GitHub from "../lib/http/github";

export default function Dashboard() {
  const { user, setRepos, setReposLoading } = useContext(AppContext);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (user && user.code) {
      fetchRepos();
    } else {
      navigateTo("/");
    }
  }, []);

  async function fetchRepos() {
    try {
      setReposLoading(true);
      const data = await GitHub.getRepositories(user.code);
      setRepos(data);
    } catch (error) {
      Alerts.showError(error.message);
    } finally {
      setReposLoading(false);
    }
  }

  return (
    <div className="vh-100 d-flex align-items-stretch">
      <aside
        className="py-5 px-3 bg-light w-25"
      >
        <SideMenu />
      </aside>

      <section className="flex-grow-1 d-flex flex-column">
        <Header />

        <main className="flex-grow-1 bg-white p-3 px-4 no-scrollbars">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
