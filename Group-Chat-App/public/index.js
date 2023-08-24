const loginHandler = async (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;

  const userData = {
    email: email,
    password: password,
  };

  try {
    const resp = await axios.post("54.166.147.171:80/login", userData);
    console.log(resp.data);
    document.cookie=`token=${resp.data.token}`;

    localStorage.removeItem("chats");
    const feedback = document.querySelector(".feedback");
    feedback.innerHTML = resp.data.message;
    feedback.style.display = "block";
    feedback.style.color = "green";
    //console.log(document.cookie)
    window.location='/public/chat.html';

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data.message);
      const feedback = document.querySelector(".feedback");
      feedback.innerHTML = error.response.data.message;
      feedback.style.display = "block";
      feedback.style.color = "red";
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
