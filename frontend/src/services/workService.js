import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

const workService = {
  getAllWorkspaces: async () => {
    const response = await axios.get(`${BASE_URL}/workspaces`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  getWorkspaceById: async (id) => {
    const response = await axios.get(`${BASE_URL}/workspaces/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },

  shareWorkspace: async (workspaceId, email, permission) => {
    const response = await axios.post(
      `${BASE_URL}/workspaces/${workspaceId}/share`,
      { email, permission },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },

  generateInviteLink: async (workspaceId, permission) => {
    const response = await axios.post(
      `${BASE_URL}/workspaces/${workspaceId}/invite`,
      { permission },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },

  acceptInvite: async (inviteToken) => {
    const response = await axios.post(
      `${BASE_URL}/workspaces/invite/${inviteToken}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },

  // create folder
  createFolder: async (name, workspaceId) => {
    const response = await axios.post(
      `${BASE_URL}/folders`,
      { name, workspaceId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },

  deleteFolder: async (folderId) => {
    const response = await axios.delete(`${BASE_URL}/folders/${folderId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  },
};

export default workService;
