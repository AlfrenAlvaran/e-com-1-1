import axios from 'axios';
import { login as authLogin } from './auth'; 

export const register = async (firstname, lastname, email, password, userType) => {
  const params = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    userType : userType 
  };

  try {
    const response = await axios.post('http://localhost:3000/api/register', params, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Assuming the response contains user type after registration
    const { userType } = response.data; // Adjust based on your API response
    return response.data

    // Store user information in local storage
    authLogin(email, userType); // Call the auth utility to store user info

    return response.data; // Adjust based on your API response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};