import axios from "axios";

const BASE_URL = "https://api.training.center.dadabayev.uz";

export const postRegister = (data) =>
  axios.post(`${BASE_URL}/api/auth/register`, data);
export const getUserMe = (token) =>
  axios.get(`${BASE_URL}/api/user/me`, {
    headers: { Authorization: "Bearer " + token },
  });
export const postLogin = (data) =>
  axios.post(`${BASE_URL}/api/auth/login`, data);
export const getThemes = (token, id) =>
  axios.get(`${BASE_URL}/api/lesson/${id ? `${id}` : "all"}`, {
    headers: { Authorization: "Bearer " + token },
  });
export const updateProfile = (token, data, id) =>
  axios.patch(`${BASE_URL}/users/${id}`, data, {
    headers: { Authorization: "Bearer " + token },
  });

export const postAnswers = (token, data) =>
  axios.post(`${BASE_URL}/user_answers`, data, {
    headers: { Authorization: "Bearer " + token },
  });

export const postAnswersTest = (token, data) =>
  axios.post(`${BASE_URL}/answers`, data, {
    headers: { Authorization: "Bearer " + token },
  });

export const postTelegramMessage = (message) =>
  axios.post(
    `https://api.telegram.org/bot6238483226:AAGqfmihU3eWu478Q2uNPqqP0QfD3kOCAM8/sendMessage`,
    {
      chat_id: "-1002192844178",
      text: message,
      parse_mode: "html",
    }
  );
