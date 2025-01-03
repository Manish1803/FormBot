import styles from "./Modal.module.css";
import { toast } from "react-hot-toast";

function DeleteModal({
  itemId,
  itemType = "item",
  onClose,
  onDelete,
  updateWorkspace,
  set,
}) {
  const handleDelete = async () => {
    try {
      await onDelete(itemId);
      toast.success(
        `${
          itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } deleted successfully.`
      );
      onClose();
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the item."
      );
    } finally {
      updateWorkspace();
      onClose();
      set();
    }
  };

  return (
    <article className={styles.modal}>
      <div className={styles.modalHeader}>
        <p className={styles.modalTitle}>
          Are you sure you want to delete this {itemType}?
        </p>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.confirm} onClick={handleDelete}>
          Confirm
        </button>
        <button type="cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </article>
  );
}

export default DeleteModal;
