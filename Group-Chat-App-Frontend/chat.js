const scrollBar = document.querySelector(".chat-container");
const loadMoreDiv = document.querySelector(".more");
let groupId=0;
let firstId = 99999;
let lastId = -1;


const getCookie = (cname) => {
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
};

const displayGroups = async () => {
  try {
    const response = await axios.get("http://localhost:3300/getgroups", {
      headers: { authorization: token },
    });
    const groups = response.data.groups;
    let str = "";
    groups.forEach((group) => {
      str += `<li><a class="dropdown-item drop-txt group-item" href="#"><div class="invisible-div">${group.id}</div>${group.name}</a></li>`;
    });

    document.querySelector(".list-of-groups").innerHTML = str;

    document.querySelectorAll(".group-item").forEach((element) => {
      element.addEventListener("click", (event) => {
        displayGroupChatHandler(event);
      });
    });
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


//finction to handle click on a group

const displayGroupChatHandler=async (event)=>{
  firstId = 99999;
  lastId = -1;
  groupId = event.target.children[0].innerHTML;
  document.querySelector('.chat-list').innerHTML=`<li class="first-chat" style="display: none;"></li>`;
  document.querySelector('.chat-heading').innerHTML=`<h5>${event.target.innerHTML}</h5>`;
  await displayOldGroupChats();
  document.querySelector('.chat-div').style.display='block';
  scrollBar.scrollTop = scrollBar.scrollHeight;
  
  //console.log(response);
  intersectionObserver.observe(loadMoreDiv);
  setInterval(displayNewGroupChats, 8000);
}

const displayOldGroupChats = async () => {
  try {
    const response = await axios.get("http://localhost:3300/groupchat", {
      headers: { authorization: token, firstid: firstId, groupid:groupId },
    });
    const fetchedChats = response.data.fetchedChats;

    if (fetchedChats.length == 0) {
      loadMoreDiv.remove();
      return;
    }
    if (lastId==-1) {
      lastId = fetchedChats[fetchedChats.length - 1].id;
    }

    firstId = fetchedChats[0].id;
    console.log('this is chats',fetchedChats);

    let str = "";
    fetchedChats.forEach((chat) => {
      str += `<li class="list-group-item chat-element"><div class="sender-name">${chat.name}</div><div class="chat-data">${chat.chatData}</div> <div class="chat-time">${chat.createdAt}</div></li>`;
    });
    const firstElement = document.querySelector(".first-chat");
    firstElement.insertAdjacentHTML("afterend", str);
    scrollBar.scrollBy(0, 100);
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


const displayNewGroupChats = async () => {
  try {
    const response = await axios.get("http://localhost:3300/newgroupchat", {
      headers: { authorization: token, lastid: lastId, groupid:groupId},
    });

    const fetchedChats = response.data.fetchedChats;

    if (!fetchedChats || fetchedChats.length == 0) {
      return;
    }

    lastId = fetchedChats[fetchedChats.length - 1].id;
    
    fetchedChats.forEach((chat) => {
      const node = document.createElement("li");
      node.setAttribute("class", "list-group-item chat-element");
      node.innerHTML = `<div class="sender-name">${chat.name}</div><div class="chat-data">${chat.chatData}</div> <div class="chat-time">${chat.createdAt}</div>`;
      document.querySelector(".chat-list").appendChild(node); 
    });
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
  setTimeout(displayOldGroupChats, 1000);
});

const sendGroupChatHandler = async (event) => {
  event.preventDefault();
  try {
    const chatData = event.target.msg.value;
    const response = await axios.post(
      "http://localhost:3300/groupchat",
      { chatData: chatData, groupId:groupId },
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

const token = getCookie("token");

displayGroups();

/*

const scrollBar = document.querySelector(".chat-container");

const loadMoreDiv = document.querySelector(".more");
const firstElement = document.querySelector(".first-chat");
let firstId = 99999;
let lastId = -1;

let chats = JSON.parse(localStorage.getItem("chats"));



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

*/
