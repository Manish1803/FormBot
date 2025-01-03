import { useEffect, useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
// import styles from "./Dashboard.module.css";
import workService from "./../../services/workService";

function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await workService.getAllWorkspaces();
        setWorkspaces(data.ownedWorkspaces.concat(data.sharedWorkspaces));
        if (data.ownedWorkspaces.length > 0) {
          fetchWorkspace(data.ownedWorkspaces[0]._id);
        }
        console.log("WORKSPACES", data);
      } catch (error) {
        console.log("ERROR FETCHING WORKSPACES", error);
      }
    };
    fetchWorkspaces();
  }, []);

  const fetchWorkspace = async (id) => {
    try {
      const workspace = await workService.getWorkspaceById(id);
      setSelectedWorkspace(workspace);
    } catch (error) {
      console.log("ERROR FETCHING WORKSPACE", error);
    }
  };

  return (
    <main style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <Header
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        fetchWorkspace={fetchWorkspace}
      />
      <Main
        selectedWorkspace={selectedWorkspace}
        setWorkspaces={setWorkspaces}
        fetchWorkspace={fetchWorkspace}
      />
    </main>
  );
}

export default Dashboard;
