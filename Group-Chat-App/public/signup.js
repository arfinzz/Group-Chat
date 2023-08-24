

const signupHandler = async (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const phoneno = event.target.phoneno.value;
  const password = event.target.password.value;

  const userData = {
    name: name,
    email: email,
    phoneno: phoneno,
    password: password,
  };

  try {
    const resp = await axios.post("54.166.147.171:80/signup", userData);
    console.log(resp.data.message);
    const feedback = document.querySelector(".feedback");
      feedback.innerHTML = resp.data.message;
      feedback.style.display = "block";
      feedback.style.color="green";
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data.message);
      const feedback = document.querySelector(".feedback");
      feedback.innerHTML = error.response.data.message;
      feedback.style.display = "block";
      feedback.style.color="red";
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
  }
};
