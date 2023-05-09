import axios from "axios";
export const url = "https://trashify.onrender.com";

export const signIn = async (data) => {
  try {
    console.log(data);
    return await axios.post(`${url}/api/auth/signin`, data);
  } catch (error) {
    console.log(error);
  }
};
export const signup = async (data) => {
  try {
    console.log("hi");
    console.log(data);
    return await axios.post(`${url}/api/auth/signup`, data);
  } catch (error) {
    console.log(error);
  }
}

export const getUser = async (id) => {
  try {
    console.log(id);
    return await axios.get(`${url}/api/users/${id}`);
  } catch (error) {
    console.log(error);
  }
};
export const trashRequest = async (data) => {
  let response = null; 
  let err = null; 
  
  await axios 
    .post(`${url}/api/trashRequest/newtrashRequest `, data)
    .then((res) => { 
      console.log("Success response from QwikGift"); 
      console.log(res.data); 
      response = res.data; 
    }) 
    .catch((error) => { 
      err=error;
      // console.log(error)
      // if (error) { 
      //   // The request was made and the server responded with a non-2xx status code 
      //   err = { 
      //     code: error.status, 
      //     message: error.message, 
      //           }; 
      // } else if (error.request) { 
      //   err = { 
      //     code: 444, 
      //     message: "The request was made but no response was received",  
      //   }; 
      // } else { 
      //   err = { 
      //     code: 408, 
      //     message: "Request Timeout", 
      //   }; 
      // } 

    }); 
  return [err, response];
}
export const payment = async (userId,amount) => {
  try {
    console.log("hi");
    return await axios.put(`${url}/api/users/updateUserCredits/?userId=${userId}&amount=${amount}` );
  } catch (error) {
    console.log(error);
  }
}