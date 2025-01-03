import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

const formService = {
  createForm: async (formData) => {
    const response = await axios.post(`${BASE_URL}/forms`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  getForm: async (formId) => {
    const response = await axios.get(`${BASE_URL}/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  updateForm: async (formId, formData) => {
    const response = await axios.put(`${BASE_URL}/forms/${formId}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  deleteForm: async (formId) => {
    const response = await axios.delete(`${BASE_URL}/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  getResponseLink: async (formId) => {
    const response = await axios.get(
      `${BASE_URL}/forms/${formId}/response-link`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  },
  submitFieldResponse: async (responseLink, fieldResponse) => {
    const response = await axios.post(
      `${BASE_URL}/forms/respond/${responseLink}/field`,
      fieldResponse
    );
    return response.data;
  },
  submitFormResponse: async (responseLink, formResponse) => {
    const response = await axios.post(
      `${BASE_URL}/forms/respond/${responseLink}`,
      formResponse
    );
    return response.data;
  },
  getFormResponses: async (formId) => {
    const response = await axios.get(`${BASE_URL}/forms/${formId}/responses`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  },
  getFormStructure: async (responseLink) => {
    const response = await axios.get(
      `${BASE_URL}/forms/respond/${responseLink}`
    );
    return response.data;
  },
};

export default formService;
