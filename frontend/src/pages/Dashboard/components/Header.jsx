import { useState } from "react";
import { useNavigate } from "react-router";
import { FaAngleDown } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import { toast } from "react-hot-toast";

import ToggleThemeButton from "./../../../contexts/ui/ToggleThemeButton";
import { useAuth } from "./../../../contexts/AuthContext";
import ShareModel from "./ShareModal";
import Overlay from "./Overlay";
import styles from "./Header.module.css";

function Header({ workspaces, selectedWorkspace, fetchWorkspace }) {
  const { logout } = useAuth();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Logout failed.");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.lheader}></div>
      <div className={styles.cheader}>
        <button
          className={styles.selected}
          onClick={() => setIsDropDownOpen((is) => !is)}
        >
          <span>
            {selectedWorkspace ? selectedWorkspace.name : "My's Workspace"}
          </span>
          {isDropDownOpen ? <IoIosArrowUp /> : <FaAngleDown />}
        </button>
        {isDropDownOpen && (
          <ul className={styles.dropdownMenu}>
            {workspaces.map(
              (workspace) =>
                workspace._id !== selectedWorkspace._id && (
                  <li key={workspace._id} className={styles.item}>
                    {workspace.name} onClick=
                    {() => {
                      fetchWorkspace(workspace._id);
                      setIsDropDownOpen(false);
                    }}
                  </li>
                )
            )}
            <li className={styles.item} onClick={() => navigate("/settings")}>
              Settings
            </li>
            <li className={styles.item} onClick={handleLogout}>
              Logout
            </li>
          </ul>
        )}
      </div>
      <div className={styles.rheader}>
        <button
          className={styles.btnPrimary}
          onClick={() => setIsShareModalOpen(true)}
        >
          Share
        </button>
        <ToggleThemeButton />
      </div>
      {isShareModalOpen && (
        <Overlay>
          <ShareModel
            workspaceId={selectedWorkspace._id}
            onClose={() => setIsShareModalOpen(false)}
          />
        </Overlay>
      )}
    </header>
  );
}

export default Header;
