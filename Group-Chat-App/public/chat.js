let msgListener;
let groupId = 0;
let firstId = 99999;
let lastId = -1;
let headingName;

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
      window.location = "/Group-Chat-App-Frontend/index.html";
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      window.location = "/Group-Chat-App-Frontend/index.html";
      console.log("Error", error.message);
    }
  }
};

//finction to handle click on a group

const displayGroupChatHandler = async (event) => {
  firstId = 99999;
  lastId = -1;
  groupId = event.target.children[0].innerHTML;
  headingName=event.target.innerHTML;
  document.querySelector(
    ".body"
  ).innerHTML = `<div class="container chat-div mt-5">
  <div class="row heading-cont">
    <div class="chat-heading col-11"><h5>${headingName}</h5></div>
    <div class="chat-options col-1">
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa fa-ellipsis-v"></i>
        </button>
        <ul
          class="dropdown-menu chat-dropdown-menu"
          aria-labelledby="dropdownMenuButton1"
        ></ul>
      </div>
    </div>
  </div>

  <div class="container chat-container">
    <div class="container more">loading...</div>
    <ul class="list-group chat-list m-0 p-0">
      <li class="first-chat" style="display: none"></li>
    </ul>
  </div>

  <div class="container send-div">
    <form
      class="send-div__chat-form"
      onsubmit="sendGroupChatHandler(event)"
    >
      <div class="row">
        <div class="col-10">
          <input type="text" id="msg" class="form-control send-chat" />
        </div>
        <div class="col">
          <button type="submit" class="btn btn-primary send-btn">
            Send
          </button>
        </div>
      </div>
    </form>
  </div>
</div>`;

  await displayOldGroupChats();

  document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight;

  let loadMoreDiv = document.querySelector(".more");
  intersectionObserver.observe(loadMoreDiv);
  msgListener=setInterval(displayNewGroupChats, 8000);
};

const reloadChat=async ()=>{
  firstId = 99999;
  lastId = -1;
  document.querySelector(
    ".body"
  ).innerHTML = `<div class="container chat-div mt-5">
  <div class="row heading-cont">
    <div class="chat-heading col-11"><h5>${headingName}</h5></div>
    <div class="chat-options col-1">
      <div class="dropdown">
        <button
          class="btn dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa fa-ellipsis-v"></i>
        </button>
        <ul
          class="dropdown-menu chat-dropdown-menu"
          aria-labelledby="dropdownMenuButton1"
        ></ul>
      </div>
    </div>
  </div>

  <div class="container chat-container">
    <div class="container more">loading...</div>
    <ul class="list-group chat-list m-0 p-0">
      <li class="first-chat" style="display: none"></li>
    </ul>
  </div>

  <div class="container send-div">
    <form
      class="send-div__chat-form"
      onsubmit="sendGroupChatHandler(event)"
    >
      <div class="row">
        <div class="col-10">
          <input type="text" id="msg" class="form-control send-chat" />
        </div>
        <div class="col">
          <button type="submit" class="btn btn-primary send-btn">
            Send
          </button>
        </div>
      </div>
    </form>
  </div>
</div>`;

  await displayOldGroupChats();

  document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight;

  let loadMoreDiv = document.querySelector(".more");
  intersectionObserver.observe(loadMoreDiv);
  msgListener=setInterval(displayNewGroupChats, 8000); 

 // console.log('chat reloaded')
}

const addMemberHandler = (event) => {
  event.preventDefault();
  clearInterval(msgListener);
  console.log(event);
  document.querySelector(".chat-div").innerHTML = `<div class="container">
  <div class="container form-elements">
    <form class="create-group-form" onsubmit="addMember(event)">
      <div class="mb-3">
        <label for="memberCredentials" class="form-label"><h5>Email or Phone No(seperate by ;)</h5></label>
        <input type="text" class="form-control" id="memberCredentials" />
      </div>

      <div class="container m-0 p-0">
        <button
          type="submit"
          class="btn btn-primary create-group-form__button create-group-btn"
        >
          Add Memebers
        </button>

        <button
          type="button"
          class="btn btn-danger create-group-form__button"

          onclick="reloadChat()"
        >
          Go back
        </button>
      </div>
    </form>

    <div class="container m-0 p-0 mt-1 feedback">
    </div>

  </div>
</div>`;
};

const addMember = async (event) => {
  event.preventDefault();
  const memberCreds = event.target.memberCredentials.value;
  const memberCredentials = memberCreds.split(";");

  const groupData = {
    groupId: groupId,
    memberCredentials: memberCredentials,
  };

  try {
    const resp = await axios.post(
      "http://localhost:3300/addmember",
      { groupData: groupData },
      { headers: { authorization: token } }
    );
    console.log(resp);
    const feedback = document.querySelector(".feedback");
    feedback.innerHTML = resp.data.message;
    feedback.style.display = "block";
    feedback.style.color = "green";
    reloadChat();
     
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

const removeMember = async (event) => {
  const userId =
    event.target.parentElement.parentElement.parentElement.children[0]
      .innerHTML;
  const userToDelete = event.target.parentElement.parentElement.parentElement;
  try {
    const resp = await axios.get("http://localhost:3300/deletemember", {
      headers: { authorization: token, groupId: groupId, userId: userId },
    });

    userToDelete.remove();
  } catch (error) {
    console.log(error);
  }
};

const toggleAdmin = async (event) => {
  const userId =
    event.target.parentElement.parentElement.parentElement.children[0]
      .innerHTML;
  const elementToToggle = event.target.parentElement;

  try {
    const response = await axios.get("http://localhost:3300/toggleadmin", {
      headers: { authorization: token, groupId: groupId, userId: userId },
    });

    if (!response.data.isAdmin) {
      elementToToggle.innerHTML = `<button type="button" class="btn btn-danger btn-sm" onclick="removeMember(event)">Remove</button>
      <button type="button" class="btn btn-success btn-sm" onclick="toggleAdmin(event)">Make Admin</button>`;
    } else {
      elementToToggle.innerHTML = `<button type="button" class="btn btn-danger btn-sm" onclick="removeMember(event)">Remove</button>
      <button type="button" class="btn btn-warning btn-sm" onclick="toggleAdmin(event)">Remove Admin</button>`;
    }
  } catch (error) {
    console.log(error);
  }
};

const editMemberHandler = async (event) => {
  event.preventDefault();
  clearInterval(msgListener);

  document.querySelector(".chat-div").innerHTML = `<div class="container">
  <div class="container form-elements member-box">
    this  is edit

    <div class="container m-0 p-0 mt-1 feedback">
    </div>

  </div>
</div>`;

  try {
    const resp = await axios.get("http://localhost:3300/getmember", {
      headers: { authorization: token, groupId: groupId },
    });
    //console.log(resp)
    fetchedMembers = resp.data.fetchedMembers;
    let memberlist = "";

    fetchedMembers.forEach((member) => {
      if (member.isAdmin) {
        memberlist += `<li class="list-group-item"><div style="display: none;">${member.id}</div> 
      <div class="row align-items-center">
      <div class="col"><div>${member.name}</div><div>${member.email}</div><div>${member.phoneno}</div></div>
      <div class="col">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeMember(event)">Remove</button>
          <button type="button" class="btn btn-warning btn-sm" onclick="toggleAdmin(event)">Remove Admin</button>
      </div>
     </li>`;
      } else {
        memberlist += `<li class="list-group-item"><div style="display: none;">${member.id}</div> 
        <div class="row align-items-center">
        <div class="col"><div>${member.name}</div><div>${member.email}</div><div>${member.phoneno}</div></div>
        <div class="col">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeMember(event)">Remove</button>
            <button type="button" class="btn btn-success btn-sm" onclick="toggleAdmin(event)">Make Admin</button>
        </div>
       </li>`;
      }
    });

    document.querySelector(".member-box").innerHTML = `<ul class="list-group">
    ${memberlist}
    
  </ul>
  <div class="go-back-btn">
  <button type="button" class="btn btn-warning btn-sm goback" onclick="reloadChat()">Go Back</button>
  </div>`;
  } catch (error) {
    console.log(error);
  }
};

const viewMemberHandler = async (event) => {
  event.preventDefault();
  clearInterval(msgListener);

  document.querySelector(".chat-div").innerHTML = `<div class="container">
  <div class="container form-elements member-box">
    this  is edit

    <div class="container m-0 p-0 mt-1 feedback">
    </div>

  </div>
</div>`;

  try {
    const resp = await axios.get("http://localhost:3300/getmember", {
      headers: { authorization: token, groupId: groupId },
    });
    //console.log(resp)
    fetchedMembers = resp.data.fetchedMembers;
    let memberlist = "";

    fetchedMembers.forEach((member) => {
      if (member.isAdmin) {
        memberlist += `<li class="list-group-item"><div style="display: none;">${member.id}</div> 
      <div class="row align-items-center">
      <div class="col"><div>${member.name}</div><div>${member.email}</div><div>${member.phoneno}</div></div>
      <div class="col">
          <button type="button" class="btn btn-success btn-sm">Admin</button>
      </div>
     </li>`;
      } else {
        memberlist += `<li class="list-group-item"><div style="display: none;">${member.id}</div> 
        <div class="row align-items-center">
        <div class="col"><div>${member.name}</div><div>${member.email}</div><div>${member.phoneno}</div></div>
       </li>`;
      }
    });

    document.querySelector(".member-box").innerHTML = `<ul class="list-group">
    ${memberlist}
    
  </ul>
  <div class="go-back-btn">
  <button type="button" class="btn btn-warning btn-sm goback" onclick="reloadChat()">Go Back</button>
  </div>`;
  } catch (error) {
    console.log(error);
  }
};

const leaveGroup=async (event)=>{
  clearInterval(msgListener);
  try {
    const resp = await axios.get("http://localhost:3300/leavegroup", {
      headers: { authorization: token, groupId: groupId},
    });

    location.reload();

  } catch (error) {
    console.log(error);
  }
}

const displayOldGroupChats = async () => {
  try {
    const response = await axios.get("http://localhost:3300/groupchat", {
      headers: { authorization: token, firstid: firstId, groupid: groupId },
    });

    //console.log(response.data)
    const fetchedChats = response.data.fetchedChats;
    const isAdmin = response.data.isAdmin;

    if (isAdmin) {
      document.querySelector(
        ".chat-dropdown-menu"
      ).innerHTML = `<li><a class="dropdown-item chat-dropdown-item add-members" onclick="addMemberHandler(event)" href="#">Add Members</a></li>
      <li><a class="dropdown-item chat-dropdown-item edit-members" onclick="editMemberHandler(event)" href="#">Edit Members</a></li>
      <li><a class="dropdown-item chat-dropdown-item leave-group" onclick="leaveGroup(event)" href="#">Leave Group</a></li>`;
    } else {
      document.querySelector(
        ".chat-dropdown-menu"
      ).innerHTML = `<li><a class="dropdown-item chat-dropdown-item" onclick="viewMemberHandler(event)" href="#">View Members</a></li>
      <li><a class="dropdown-item chat-dropdown-item" onclick="leaveGroup(event)" href="#">Leave Group</a></li>`;
    }

    if (fetchedChats.length == 0) {
      document.querySelector(".more").remove();
      return;
    }
    if (lastId == -1) {
      lastId = fetchedChats[fetchedChats.length - 1].id;
    }

    firstId = fetchedChats[0].id;
    //console.log("this is chats", fetchedChats);

    let str = "";
    fetchedChats.forEach((chat) => {
      str += `<li class="list-group-item chat-element"><div class="sender-name">${chat.name}</div><div class="chat-data">${chat.chatData}</div> <div class="chat-time">${chat.createdAt}</div></li>`;
    });
    document.querySelector(".first-chat").insertAdjacentHTML("afterend", str);
    document.querySelector(".chat-container").scrollBy(0, 100);
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
      headers: { authorization: token, lastid: lastId, groupid: groupId },
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
      { chatData: chatData, groupId: groupId },
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

