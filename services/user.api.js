import axios from 'axios';
export const url = 'http://localhost:8000';

export const signIn = async (data) => {
  try {
      console.log(data);
      return await axios.post(`${url}/api/auth/signin`, data);
  } catch (error) {
      console.log(error)
  }
}
export const signup = async (data) => {
  try {
      console.log(data);
      return await axios.post(`${url}/api/auth/signup`, data);
  } catch (error) {
      console.log(error)
  }
}
export const dustbinRequest = async (data) => {
  try {
      console.log(data);
      return await axios.post(`${url}/api/api/dustbins/dustbinrequest`, data);
  } catch (error) {
      console.log(error)
  }
}