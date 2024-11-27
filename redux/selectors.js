import { useSelector } from "react-redux";

export const useSelectorState = (name) => useSelector((state) => state[name]);
