import { useContext, useEffect, useState } from "react";
import "chartjs-adapter-moment";
import RepoStats from "../components/RepoStats";
import Alerts from "../lib/alerts";
import GitHub from "../lib/http/github";
import AppContext from "../contexts/AppContext";
import { Pie, Scatter } from "react-chartjs-2";
import Spinner from "../components/Spinner";

import {
  Chart,
  PieController,
  ArcElement,
  LinearScale,
  TimeScale,
  PointElement,
} from "chart.js";
Chart.register(ArcElement, PieController, LinearScale, TimeScale, PointElement);

export default function Overview() {
  return (
    <div>
      <h1>Overview Page</h1>

      <div className="container mt-3">
        <div className="row">
          <div className="col-6 mb-4">
            <UserInfo />
          </div>
          <div className="col-6 mb-4">
            <CommitFreq />
          </div>
          <div className="col-6 mb-4">
            <PullReqs />
          </div>

          <div className="col-6 mb-4">
            <IssueRating />
          </div>
        </div>
      </div>
    </div>
  );
}

function CommitFreq() {
  const [isLoading, setLoading] = useState(false);
  const { user } = useContext(AppContext);
  const [data, setData] = useState(null);

  async function onSelectionChange(repoName) {
    try {
      setLoading(true);
      const data = await GitHub.getRepoCommits(repoName, user.code);

      const authors = data.map((d) => d[0]);
      const dateObjects = data.map((d) => new Date(d[1]));

      setData({
        authors: authors,
        dates: dateObjects,
      });
    } catch (error) {
      Alerts.showError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RepoStats
      title="Commit Frequency"
      onSelectionChange={onSelectionChange}
      isLoading={isLoading}
    >
      {data == null ? (
        <Spinner />
      ) : (
        <Scatter
          data={{
            datasets: [
              {
                labels: "Commits",
                data: data.dates.map((date, index) => ({
                  x: date,
                  y: index + 1,
                })),
              },
            ],
          }}
          options={{
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
              y: {
                display: true,
                text: "Number of commits",
              },
            },
          }}
        />
      )}
    </RepoStats>
  );
}

function PullReqs() {
  const [isLoading, setLoading] = useState(false);
  const { user } = useContext(AppContext);
  const [data, setData] = useState(null);

  async function onSelectionChange(repoName) {
    try {
      setLoading(true);
      const data = await GitHub.getRepoPRs(repoName, user.code);

      const titles = data.map((d) => d[0]);
      const dateObjects = data.map((d) => new Date(d[1]));

      setData({
        titles,
        dates: dateObjects,
      });
    } catch (error) {
      Alerts.showError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RepoStats
      title="Pull Requests"
      onSelectionChange={onSelectionChange}
      isLoading={isLoading}
    >
      {data == null ? (
        <Spinner />
      ) : (
        <Scatter
          data={{
            datasets: [
              {
                labels: "Pull Requests",
                data: data.dates.map((date, index) => ({
                  x: date,
                  y: index + 1,
                })),
              },
            ],
          }}
          options={{
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
              y: {
                display: true,
                text: "Number of pull requests",
              },
            },
          }}
        />
      )}
    </RepoStats>
  );
}

function IssueRating() {
  const [isLoading, setLoading] = useState(false);
  const { user } = useContext(AppContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats(repoName) {
    try {
      setLoading(true);
      const data = await GitHub.getIssueRating(user.code);
      setData(data);
    } catch (error) {
      Alerts.showError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <section className="d-flex justify-content-between align-items-center card-header">
        <h4>Issue Resolution</h4>
      </section>

      <section className="card-body">
        {isLoading || data == null ? (
          <Spinner />
        ) : (
          <Pie
            data={{
              labels: ["Closed", "Open"],
              datasets: [
                {
                  data: [data.closed, data.open],
                  backgroundColor: ["green", "red"],
                },
              ],
            }}
            options={{
              legend: { display: true, position: "bottom" },
              datalabels: {
                display: true,
                color: "white",
              },
            }}
          />
        )}
      </section>
    </div>
  );
}

function UserInfo() {
  const { user } = useContext(AppContext);

  return (
    <div className="card">
      <section className="d-flex justify-content-between align-items-center card-header">
        <h4>User Info</h4>
      </section>

      <section className="card-body">
        <div>
          <strong>Followers: </strong> {user.followers}
        </div>

        <div>
          <strong>Following: </strong> {user.following}
        </div>

        {user.bio && (
          <div>
            <strong>Bio:</strong>
            <p className="m-0 mt-1">{user.bio}</p>
          </div>
        )}
      </section>
    </div>
  );
}
