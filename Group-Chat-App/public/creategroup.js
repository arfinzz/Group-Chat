const token = getCookie("token");

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

const createGroupHandler = async (event) => {
    event.preventDefault();
    const groupName = event.target.name.value;
    const memberCreds=event.target.memberCredentials.value;
    const memberCredentials=memberCreds.split(";");
  
    const groupData = {
      groupName:groupName,
      memberCredentials:memberCredentials
    };
  
    try {
      const resp = await axios.post("54.166.147.171:80/creategroup", {groupData:groupData},{ headers: { authorization: token }});
      console.log(resp);
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
  