import {
  faChartLine,
  faDiagramProject,
  faPeopleGroup,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../contexts/AppContext";
import Auth from "../lib/http/auth";

const menuItems = [
  {
    text: "Overview",
    to: "/dash",
    icon: faChartLine,
  },
  {
    text: "Repositories",
    to: "repos",
    icon: faDiagramProject,
  },
  {
    text: "Organizations",
    to: "organizations",
    icon: faPeopleGroup,
  },
];

export default function SideMenu() {
  const { user, setAppUser } = useContext(AppContext);
  const navigateTo = useNavigate();

  async function logout() {
    await Auth.logout(user.code);
    setAppUser(null);
    navigateTo("/");
  }
  return (
    <>
      <div
        className="m-auto"
        style={{
          maxWidth: "5em",
        }}
      >
        <img src="/img/logo.png" alt="brand logo" className="img-fluid" />
      </div>
      <nav className="mt-4">
        <ul className="nav flex-column">
          {menuItems.map((menuItem, i) => (
            <NavLink {...menuItem} key={i} />
          ))}
        </ul>
        <div className="d-grid mt-4">
          <button className="btn btn-outline-danger" onClick={logout}>
            Sign Out
            <FontAwesomeIcon icon={faSignOut} className="ms-3" />
          </button>
        </div>
      </nav>
    </>
  );
}

function NavLink({ text, to, icon, ...rest }) {
  return (
    <li className="nav-item">
      <Link to={to} className="nav-link">
        <FontAwesomeIcon icon={icon} className="me-2" />
        {text}
      </Link>
    </li>
  );
}
