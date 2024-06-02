import { atom, DefaultValue } from "recoil";

interface User {
  id: number;
  username: string;
}
export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
