import { useState } from "react";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

import workService from "./../../../services/workService";
import styles from "./Modal.module.css";

function ShareModel({ workspaceId, onClose }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [inviteLink, setInviteLink] = useState("");

  const handleShareWorkspace = async () => {
    try {
      const response = await workService.shareWorkspace(
        workspaceId,
        email,
        permission
      );
      toast.success(response.message);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to share workspace");
    }
  };

  const handleGenerateLink = async () => {
    try {
      const response = await workService.generateInviteLink(
        workspaceId,
        permission
      );
      setInviteLink(response.inviteLink);
      navigator.clipboard.writeText(response.inviteLink);
      toast.success("Link copied to clipboard");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate link");
    }
  };

  return (
    <article className={styles.modalw}>
      <div className={styles.btnClose} onClick={onClose}>
        <RxCross2 color="#F55050" size="2rem" />
      </div>
      <div className={styles.header}>
        <p className={styles.title}>Invite by Email</p>
        <select
          name="permission"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          id="permission"
        >
          <option value="view">View</option>
          <option value="edit">Edit</option>
        </select>
      </div>
      <div className={styles.modalBody}>
        <input
          type="text"
          placeholder="Enter email id"
          value={email}
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.btn} onClick={handleShareWorkspace}>
          Send Invite
        </button>
      </div>
      <div className={styles.footer}>
        <p className={styles.title}>Invite by link</p>
        <button className={styles.btn} onClick={handleGenerateLink}>
          Copy link
        </button>
      </div>
      {inviteLink && (
        <div className={styles.link}>
          <p>{inviteLink}</p>
        </div>
      )}
    </article>
  );
}

export default ShareModel;
