import styles from "./Header.module.css";

import { NavLink, useNavigate } from "react-router";
import ToggleThemeButton from "./../../../contexts/ui/ToggleThemeButton";
import { RxCross2 } from "react-icons/rx";
import { useBuilder } from "../../../contexts/FormBuilderContext";
import { useState } from "react";
import formService from "../../../services/formService";
import { toast } from "react-hot-toast";

function Header() {
  const navigate = useNavigate();
  const { fields, form } = useBuilder();
  const [formName, setFormName] = useState(form.title);
  const [isSaving, setIsSaving] = useState(false);
  const [sharedLink, setSharedLink] = useState("");

  const handleShare = async () => {
    try {
      const response = await formService.getResponseLink(form.id);
      setSharedLink(response.responseLink);
      navigator.clipboard.writeText(response.responseLink);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateForm = { title: formName, fields };
      await formService.updateForm(form.id, updateForm);
      toast.success("Form saved successfully");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.lheader}>
        <input
          type="text"
          placeholder="Enter form name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className={styles.name}
        />
      </div>
      <div className={styles.cheader}>
        <NavLink to="flow" className={styles.tab}>
          Flow
        </NavLink>
        <NavLink to="response" className={styles.tab}>
          Response
        </NavLink>
      </div>
      <div className={styles.rheader}>
        <RxCross2
          size="2rem"
          color="#F55050"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
        <button
          className={`${styles.btn} ${styles.save}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          Save
        </button>
        <button
          className={`${styles.btn} ${styles.share}`}
          onClick={handleShare}
        >
          Share
        </button>
        <ToggleThemeButton />
      </div>
    </header>
  );
}

export default Header;
