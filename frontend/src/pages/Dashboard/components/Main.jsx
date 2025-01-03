import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { FiFolderPlus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";

import formService from "./../../../services/formService";
import workService from "./../../../services/workService";
import Overlay from "./Overlay";
import CreateFolderModal from "./CreateFolderModal";
import DeleteModal from "./DeleteModal";

import styles from "./Main.module.css";

function Main({ selectedWorkspace, fetchWorkspace }) {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFolderDeleteModal, setIsFolderDeleteModal] = useState(false);
  const [isFormDeleteModal, setIsFormDeleteModal] = useState(false);
  const [itemId, setItemId] = useState(null);

  const updateWorkspace = () => {
    fetchWorkspace(selectedWorkspace._id);
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder((prev) => (prev?._id === folder._id ? null : folder));
  };

  const handleDeleteFolder = (folderId) => {
    setItemId(folderId);
    setIsFolderDeleteModal(true);
  };

  const handleDeleteForm = (formId) => {
    setItemId(formId);
    setIsFormDeleteModal(true);
  };

  const handleCreateForm = async () => {
    try {
      const formData = {
        title: "New Form",
        fields: [],
        workspaceId: selectedWorkspace._id,
        folderId: selectedFolder?._id || null,
      };
      const newForm = await formService.createForm(formData);
      navigate(`/workspace/${newForm._id}`);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while creating the form."
      );
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.folderList}>
        <div
          className={styles.createFolder}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FiFolderPlus size="2.2rem" />
          Create a folder
        </div>
        {isCreateModalOpen && (
          <Overlay>
            <CreateFolderModal
              workspaceId={selectedWorkspace._id}
              onClose={() => setIsCreateModalOpen(false)}
              updateWorkspace={updateWorkspace}
            />
          </Overlay>
        )}
        {selectedWorkspace?.folders?.length > 0 && (
          <ul className={styles.folders}>
            {selectedWorkspace.folders.map((folder) => (
              <li
                key={folder._id}
                className={`${styles.folder} ${
                  selectedFolder?._id === folder._id ? styles.selected : ""
                }`}
                onClick={() => handleFolderClick(folder)}
              >
                <span>{folder.name}</span>

                <div
                  className={styles.btnDelete}
                  onClick={() => handleDeleteFolder(folder._id)}
                >
                  <RiDeleteBin6Line size="2rem" color="#F55050" />
                </div>
              </li>
            ))}
            {isFolderDeleteModal && (
              <Overlay>
                <DeleteModal
                  itemId={itemId}
                  itemType="folder"
                  onClose={() => setIsFolderDeleteModal(false)}
                  onDelete={(id) => workService.deleteFolder(id)}
                  updateWorkspace={updateWorkspace}
                />
              </Overlay>
            )}
          </ul>
        )}
      </div>
      <div className={styles.formList}>
        <div className={styles.createTypeBot} onClick={handleCreateForm}>
          <span>
            <GoPlus size="4rem" />
          </span>
          <p className={styles.formTitle}>Create a typebot</p>
        </div>
        {selectedFolder
          ? selectedFolder?.forms.map((form) => (
              <div
                className={styles.form}
                key={form._id}
                onClick={() => navigate(`/workspace/${form._id}`)}
              >
                <p className={styles.formTitle}>{form.title}</p>
                <div className={styles.btnDeleteForm}>
                  <RiDeleteBin6Line
                    size="2rem"
                    color="#F55050"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteForm(form._id);
                    }}
                  />
                </div>
              </div>
            ))
          : selectedWorkspace?.forms.map((form) => (
              <div
                className={styles.form}
                key={form._id}
                onClick={() => navigate(`/workspace/${form._id}`)}
              >
                <p className={styles.formTitle}>{form.title}</p>
                <div className={styles.btnDeleteForm}>
                  <RiDeleteBin6Line
                    size="2rem"
                    color="#F55050"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteForm(form._id);
                    }}
                  />
                </div>
              </div>
            ))}
      </div>
      {isFormDeleteModal && (
        <Overlay>
          <DeleteModal
            itemId={itemId}
            itemType="form"
            onClose={() => setIsFormDeleteModal(false)}
            onDelete={(id) => formService.deleteForm(id)}
            updateWorkspace={updateWorkspace}
            set={() => setSelectedFolder(null)}
          />
        </Overlay>
      )}
    </section>
  );
}

export default Main;
