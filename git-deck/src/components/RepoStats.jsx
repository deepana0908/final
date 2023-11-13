import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import AppContext from "../contexts/AppContext";
import Spinner from "./Spinner";

export default function RepoStats({
  title,
  onSelectionChange,
  isLoading = false,
  children,
}) {
  const { repos, isReposLoading } = useContext(AppContext);

  function handleChange(ev) {
    const value = ev.target.value;
    onSelectionChange(value);
  }

  return (
    <div className="card">
      <section className="d-flex justify-content-between align-items-center card-header">
        <h4>{title}</h4>

        {isReposLoading ? (
          <div>
            <FontAwesomeIcon icon={faSpinner} className="spinner-icon" />
          </div>
        ) : (
          <select
            className="form-select form-select-sm"
            aria-label="Repo select"
            style={{
              maxWidth: "10em",
            }}
            onChange={handleChange}
          >
            {repos.map((repo) => (
              <option value={repo.name} key={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        )}
      </section>

      <section className="card-body">
        {isLoading ? <Spinner /> : children}
      </section>
    </div>
  );
}
