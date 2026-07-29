import { apiHeader, baseUrl } from "@/constants/config";
import { Hymn, LoginResponse } from "@/types";
import { toast } from "react-toastify";
import { EachCategory } from "@/store/categoryStore";

export async function loginUser(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (!res.ok) throw new Error("Login failed!");
  const data = await res.json();
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

// export async function updateAdminUser(){

// }

export async function fetchHymns(): Promise<Hymn[]> {
  const res = await fetch(`${baseUrl}/hymn`, {
    method: "GET",
    headers: apiHeader(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch hymn: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function createHymn(data: Omit<Hymn, "_id">): Promise<Hymn> {
  const res = await fetch(`${baseUrl}/hymn`, {
    method: "POST",
    headers: apiHeader(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create hymn: ${res.status}`,
    );
  }

  const result = await res.json();
  if (result.message) {
    toast.success(result.message, {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(result);
  }
  return result;
}

export async function updateHymn(
  id: string,
  data: Partial<Hymn>,
): Promise<Hymn> {
  const res = await fetch(`${baseUrl}/hymn/${id}`, {
    method: "PUT",
    headers: apiHeader(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update hymn: ${res.status}`,
    );
  }

  const result = await res.json();
  if (result.message) {
    toast.success(result.message, {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(result);
  }
  return result;
}

export async function deleteHymn(id: string): Promise<void> {
   const res = await fetch(`${baseUrl}/hymn/${id}`, {
    method: "DELETE",
    headers: apiHeader(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete hymn: ${res.status}`,
    );
  }

  const result = await res.json();
  if (result.message) {
    toast.success(result.message, {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(result);
  }
  return result;
}

export async function createCategory(data: Omit<EachCategory, "_id">) {
  const res = await fetch(`${baseUrl}/category`, {
    method: "POST",
    headers: apiHeader(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create category: ${res.status}`,
    );
  }

  const result = await res.json();
  if (result.message) {
    toast.success(result.message, {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(result);
  }
  return result;
}

export async function getCategories() {
  const res = await fetch(`${baseUrl}/category`, {
    method: "GET",
    headers: apiHeader(),
  });
  if (!res.ok) throw new Error();
  const data = await res.json();
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
   const res = await fetch(`${baseUrl}/category/${id}`, {
    method: "DELETE",
    headers: apiHeader(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete category: ${res.status}`,
    );
  }

  const result = await res.json();
  if (result.message) {
    toast.success(result.message, {
      position: "top-right",
      autoClose: 3000,
    });
  } else {
    toast.error(result);
  }
  return result;
}