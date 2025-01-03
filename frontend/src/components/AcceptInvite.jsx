import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import workService from "./../services/workService";

function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function acceptInvite() {
      try {
        const response = await workService.acceptInvite(token);
        toast.success(response.message);
        navigate("/dashboard");
      } catch (error) {
        toast.error(error.response?.message || "Failed to accept invite");
      } finally {
        navigate("/");
      }
    }
    acceptInvite();
  }, [token, navigate]);

  return (
    <section
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid var(--border-color)",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        <p style={{ fontSize: "1.6rem" }}>Processing your invite...</p>
      </div>
    </section>
  );
}

export default AcceptInvite;
