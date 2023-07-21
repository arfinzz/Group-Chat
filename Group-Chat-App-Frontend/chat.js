const scrollBar = document.querySelector(".chat-container");
const token = getCookie("token");
const loadMoreDiv = document.querySelector(".more");
let pageno = 1;

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

const sendHandler = async (event) => {
  event.preventDefault();
  try {
    const chatData = event.target.msg.value;
  const  response=await axios.post(
    "http://localhost:3300/chat",
    { chatData: chatData },
    { headers: { authorization: token } }
  );
  //console.log(response);
  const chat=response.data.chat;
  const node = document.createElement("li");
  node.setAttribute("class", "chat-container__chat");
  node.innerHTML=`<div class="sender-name">${chat.name} :</div><div class="message-data">${chat.chatData}</div> <div class="time-div">${chat.time}</div>`;
  document.querySelector(".chat-container__list").appendChild(node);
  event.target.msg.value="";
  scrollBar.scrollTo(0, scrollBar.scrollHeight);

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if(error.response.status==401)
      {
        window.location='/Group-Chat-App-Frontend/index.html'
      }
      else
      {
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

const getChats = async (pageno) => {
  try {
    const response = await axios.get("http://localhost:3300/chat", {
      headers: { authorization: token, pageno: pageno },
    });
    //console.log(response)
    return response.data.chats;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if(error.response.status==401)
      {
        window.location='/Group-Chat-App-Frontend/index.html'
      }
      else
      {
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

const displayChats = async () => {
  try {
    const fetchedChats = await getChats(pageno);
    if (!fetchedChats) {
      loadMoreDiv.remove();
      return;
    }
    let str = "";
    fetchedChats.forEach((chat) => {
      str += `<li class="chat-container__chat"> <div class="sender-name">${chat.name} :</div><div class="message-data">${chat.chatData}</div> <div class="time-div">${chat.time}</div> </li>`;
    });

    const firstElement = document.querySelector(".first-chat");
    firstElement.insertAdjacentHTML("afterend", str);
    scrollBar.scrollBy(0, 100);
    pageno++;
  } catch (err) {
    console.log(err);
  }
};

displayChats();

const intersectionObserver = new IntersectionObserver((entries) => {
  if (entries[0].intersectionRatio <= 0) return;
  // load more content;
  setTimeout(displayChats, 1000);
});
// start observing
intersectionObserver.observe(loadMoreDiv);

scrollBar.scrollTo(0, scrollBar.scrollHeight);

//window.location='/Group-Chat-App-Frontend/index.html'
