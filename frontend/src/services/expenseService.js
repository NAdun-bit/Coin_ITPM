import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses"; // Change this to your backend endpoint

export const fetchExpenses = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addExpense = async (expenseData) => {
  const res = await axios.post(API_URL, expenseData);
  return res.data;
};

export const updateExpense = async (id, expenseData) => {
  const res = await axios.put(`${API_URL}/${id}`, expenseData);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
