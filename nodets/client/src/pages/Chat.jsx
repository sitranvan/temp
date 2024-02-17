import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import socket from "../utils/socket";
import { Button } from "@mui/material";
import axios from "axios";
import axiosClient from "../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";

const user = [
  {
    name: "Si Tran",
    username: "User65b0c9cf8c95c6a0d03bd386",
  },
  {
    name: "Pham Dong",
    username: "User65b0c9db8c95c6a0d03bd388",
  },
  {
    name: "Thang Vo",
    username: "User65b0c9e58c95c6a0d03bd38a",
  },
  {
    name: "Thanh Hai",
    username: "User65b0c9f78c95c6a0d03bd38c",
  },
];

const LIMIT = 10;
const PAGE = 1;
export default function Chat() {
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [pagination, setPagination] = useState({
    total_page: 0,
    page: PAGE,
  });
  const profile = JSON.parse(localStorage.getItem("profile"));

  const getProfile = (username) => {
    console.log(username);
    axiosClient.get(`/users/${username}`).then((res) => {
      setReceiver(res.data.user._id);
      alert(`Đã chọn ${res.data.user.name} để chat`);
    });
  };
  useEffect(() => {
    socket.auth = {
      _id: profile._id,
    };
    // Kết nối tới server socket đang lắng nghe ở port 3000
    socket.connect();

    socket.on("receiver_chat", (data) => {
      const { payload } = data;
      console.log("payload", payload);
      console.log("payload,", payload);
      setConversations((conversations) => [...conversations, payload]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Lấy tin nhắn từ database

    if (receiver) {
      axiosClient
        .get(`/conversations/receivers/${receiver}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          params: {
            limit: LIMIT,
            page: PAGE,
          },
        })
        .then((res) => {
          const { total_page, page } = res.data.result.pagination;
          setConversations(res.data.result.conversations);
          setPagination({
            total_page,
            page,
          });
        });
    }
  }, [receiver]);

  const fetchMoreConversations = () => {
    if (receiver) {
      axiosClient
        .get(`/conversations/receivers/${receiver}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          params: {
            limit: LIMIT,
            page: pagination.page + 1,
          },
        })
        .then((res) => {
          const { total_page, page } = res.data.result.pagination;
          const { conversations } = res.data.result;
          setConversations((prev) => [...prev, ...conversations]);
          setPagination({
            total_page,
            page,
          });
        });
    }
  };

  const send = (e) => {
    e.preventDefault();
    setValue("");
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver,
    };
    socket.emit("chat", {
      payload: conversation,
      to: receiver,
      from: profile._id,
    });
    setConversations((conversations) => [
      {
        ...conversation,
        _id: new Date().getTime(), // Vì khi nhấn gửi thì lúc này bên mongo mới insert nên chưa có id nên dùng tạm id này để truyền key không báo lỗi
      },
      ...conversations,
    ]);
    console.log(conversations);
  };

  return (
    <div>
      <h1>Chat</h1>
      <h3>User</h3>
      {user.map((item, index) => (
        <div key={index}>
          <Button
            sx={{
              mt: 2,
              color: profile.username == item.username ? "blue" : "black",
              pointerEvents: profile.username == item.username ? "none" : "",
            }}
            onClick={() => getProfile(item.username)}
            variant="outlined"
          >
            {item.name}
          </Button>
        </div>
      ))}
      <form method="POST" onSubmit={send}>
        <input
          value={value}
          type="text"
          placeholder="Nhập nội dung chat"
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Gửi</button>
      </form>
      <div
        id="scrollableDiv"
        style={{
          height: 300,
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
          dataLength={conversations.length}
          next={fetchMoreConversations}
          style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={pagination.page < pagination.total_page}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {conversations.map((conversation, index) => (
            <div
              className={
                conversation.sender_id === profile._id
                  ? "message-right"
                  : "message-left"
              }
              key={conversation._id}
            >
              {conversation.content}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
