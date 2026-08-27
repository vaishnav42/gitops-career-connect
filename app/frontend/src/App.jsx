import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend unavailable");
        }
        return response.json();
      })
      .then((data) => {
        setStatus(data.status);
      })
      .catch(() => {
        setStatus("DOWN");
      });

    fetch("/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error("Failed to fetch jobs:", error);
      });
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Career Connect</h1>
        <p>DevOps & Cloud Career Platform</p>
      </header>

      <section className="status">
        <h2>System Status</h2>
        <p>
          Backend:{" "}
          <strong className={status === "UP" ? "up" : "down"}>
            {status}
          </strong>
        </p>
      </section>

      <section>
        <h2>Latest Opportunities</h2>

        <div className="jobs">
          {jobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <span>{job.location}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;