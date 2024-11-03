import axios from 'axios';
import { login as authLogin } from './auth'; // Import the login function from auth.js

export const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email,
      password,
    });

    // Assuming the response contains user type
    const { userType } = response.data; // Adjust based on your API response

    // Store user information in local storage
    authLogin(email, userType); // Call the auth utility to store user info

    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};