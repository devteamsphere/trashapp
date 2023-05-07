import axios from "axios";
export const url = "https://trashify.onrender.com";

export const getPendingDustbinRequest = async (coords) => {
  let response = null;
  let err = null;

  await axios
    .post(`${url}/trashRequest/calculateDistance`, coords)
    .then((res) => {
      console.log("Success response from Backend");
      console.log(res.data);
      response = res.data;
    })
    .catch((error) => {
      err = error;
    });
    console.log(err);
    console.log(response);
  return [err, response];
};
