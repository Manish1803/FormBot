import { GoPlus } from "react-icons/go";

function CreateTypeBotButton() {
  return (
    <div
      style={{
        cursor: "pointer",
        padding: "2rem",
        backgroundColor: "#1a5fff",
        color: "#fff",
        borderRadius: "1rem",
        width: "20rem",
        height: "25rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>
        <GoPlus size="4rem" />
      </span>
      <p style={{ marginTop: "1rem", fontSize: "1.6rem" }}>Create a typebot</p>
    </div>
  );
}

export default CreateTypeBotButton;
