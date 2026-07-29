import { useAuthStore } from "@/store/userStore";

export const baseUrl = `https://hymnal-backend-plum.vercel.app`;

export const apiHeader = () => {
const token = useAuthStore.getState().user?.token;
  const getHeader = new Headers();
  getHeader.append("Authorization", `Bearer ${token}`);
  getHeader.append("Content-Type", "application/json");
  return getHeader
}
