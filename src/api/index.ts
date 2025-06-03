"use client";
import axios from "axios";
import { baseUrl } from "@/api/const";

const getAccessToken = () => {
  try {
    const ISSERVER = typeof window === "undefined";

    if (ISSERVER) {
      return null;
    }
    const localData = localStorage?.getItem("user-state");

    const state = localData ? JSON.parse(localData) : null;

    const user = state?.state?.user;

    if (!user) {
      return null;
    }

    const accessToken = user?.token;

    return accessToken;
  } catch (error) {
    return null;
  }
};

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    "x-access-token": getAccessToken(),
  },
});

type postReqType = {
  url: string;
  data: any;
};

export const postRequest = async ({ url, data }: postReqType) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Something went wrong";
    return {
      error: true,
      message,
    };
  }
};

export const getRequest = async (url: string) => {
  try {
    const res = await api.get(url);
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Something went wrong";
    return {
      error: true,
      message,
    };
  }
};

export const patchRequest = async ({ url, data }: postReqType) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Something went wrong";
    return {
      error: true,
      message,
    };
  }
};

type ImageUpload = {
  file: any;
};

export const uploadImage = async ({ file }: ImageUpload) => {


  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post(`/images/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Something went wrong";
    return {
      error: true,
      message,
    };
  }
};


// Add the deleteRequest function
export const deleteRequest = async (url: string) => {
  try {
    const res = await api.delete(url);
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Something went wrong";
    return {
      error: true,
      message,
    };
  }
};

// Add the file upload function
type FileUpload = {
  file: File;
  url: string;
};

export const uploadFile = async ({ file, url }: FileUpload) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Something went wrong";
    return {
      error: true,
      message,
    };
  }
};


