import { useContext } from "react";
import logo from "/img/logo.png";
import AppContext from "../contexts/AppContext";

export default function Header() {
    const {user} = useContext(AppContext);

  return (
    <header className="d-flex justify-content-end align-items-center gap-2 p-3 px-4 bg-white border-bottom">
      <div
        className="rounded-circle overflow-hidden"
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
        }}
      >
        <img src={user.avatarUrl} alt="user avatar" className="img-fluid" />
      </div>
      <h6 className="m-0">{user.name || user.username}</h6>
    </header>
  );
}
