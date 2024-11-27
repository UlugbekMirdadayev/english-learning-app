// reducers/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (_, { payload }) => {
      AsyncStorage.setItem("user", JSON.stringify(payload));
      return payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
