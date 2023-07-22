const scrollBar = document.querySelector(".chat-container");
const token = getCookie("token");
const loadMoreDiv = document.querySelector(".more");
const firstElement = document.querySelector(".first-chat");
let firstId = 99999;
let lastId = -1;

let chats = JSON.parse(localStorage.getItem("chats"));

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

const displayChats = async (chatstoinsert) => {
  try {
    let str = "";
    chatstoinsert.forEach((chat) => {
      str += `<li class="chat-container__chat"> <div class="sender-name">${chat.name} :</div><div class="message-data">${chat.chatData}</div> <div class="time-div">${chat.time}</div> </li>`;
    });

    firstElement.insertAdjacentHTML("afterend", str);
    scrollBar.scrollBy(0, 100);
  } catch (err) {
    console.log(err);
  }
};

const getChats = async () => {
  try {
    const response = await axios.get("http://localhost:3300/chat", {
      headers: { authorization: token, firstid: firstId },
    });
    const fetchedChats = response.data.chats;
    if (fetchedChats.length == 0) {
      loadMoreDiv.remove();
      return;
    }
    if (chats.length == 0) {
      lastId = fetchedChats[fetchedChats.length - 1].id;
    }

    if (chats.length < 10) {
      let temp = fetchedChats.concat(chats);
      while (temp.length > 10) {
        temp.shift();
      }
      chats = temp;
      localStorage.setItem("chats", JSON.stringify(chats));
    }

    firstId = fetchedChats[0].id;
    displayChats(fetchedChats);
    return;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status == 401) {
        window.location = "/Group-Chat-App-Frontend/index.html";
      } else {
        console.log(error.response.data.message);
      }
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

const sendHandler = async (event) => {
  event.preventDefault();
  try {
    const chatData = event.target.msg.value;
    const response = await axios.post(
      "http://localhost:3300/chat",
      { chatData: chatData },
      { headers: { authorization: token } }
    );
    //console.log(response);
    event.target.msg.value = "";
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status == 401) {
        window.location = "/Group-Chat-App-Frontend/index.html";
      } else {
        console.log(error.response.data.message);
      }
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

const displayNewChats = async (chatstoinsert) => {
  try {
    chatstoinsert.forEach((chat) => {
      const node = document.createElement("li");
      node.setAttribute("class", "chat-container__chat");
      node.innerHTML = `<div class="sender-name">${chat.name} :</div><div class="message-data">${chat.chatData}</div> <div class="time-div">${chat.time}</div>`;
      document.querySelector(".chat-container__list").appendChild(node);
    });
  } catch (err) {
    console.log(err);
  }
};

const getNewChats = async () => {
  try {
    const response = await axios.get("http://localhost:3300/newchat", {
      headers: { authorization: token, lastid: lastId },
    });

    const fetchedChats = response.data.chats;

    if (fetchedChats.length == 0) {
      return;
    }

    lastId = fetchedChats[fetchedChats.length - 1].id;
    let temp = chats.concat(fetchedChats);
    while (temp.length > 10) {
      temp.shift();
    }
    chats = temp;
    localStorage.setItem("chats", JSON.stringify(chats));
    await displayNewChats(fetchedChats);
    //return response.data.chats;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status == 401) {
        window.location = "/Group-Chat-App-Frontend/index.html";
      } else {
        console.log(error.response.data.message);
      }
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

const intersectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].intersectionRatio <= 0) return;
  // load more content;
  setTimeout(getChats, 1000);
});

if (chats) {
  firstId = chats[0].id;
  lastId = chats[chats.length - 1].id;
  displayChats(chats);
} else {
  chats = [];
  getChats();
}

intersectionObserver.observe(loadMoreDiv);
setInterval(getNewChats, 8000);

