import { useState } from "react";
import { toast } from "react-hot-toast";
import workService from "./../../../services/workService";

import styles from "./Modal.module.css";

function CreateFolderModal({ workspaceId, onClose, updateWorkspace }) {
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!folderName) return toast.error("Folder name is required.");

    try {
      await workService.createFolder(folderName, workspaceId);
      toast.success("Folder created successfully.");
      onClose();
    } catch (error) {
      toast.error(error.message);
    }

    updateWorkspace();
  };

  return (
    <article className={styles.modal}>
      <div className={styles.modalHeader}>
        <p className={styles.title}>Create New Folder</p>
        <input
          type="text"
          placeholder="Enter folder name"
          className={styles.input}
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </div>
      <div className={styles.modalFooter}>
        <button
          className={styles.confirm}
          type="submit"
          onClick={handleCreateFolder}
        >
          Done
        </button>
        <button type="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </article>
  );
}

export default CreateFolderModal;
