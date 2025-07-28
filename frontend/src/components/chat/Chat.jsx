
import { useState, useEffect } from "react";
import { getUserChats, getChatMessages, sendMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import "./chat.scss";

function Chat({ activeChatId }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChatId && chats.length > 0) {
      const chat = chats.find(c => c._id === activeChatId);
      if (chat) {
        setSelectedChat(chat);
        fetchMessages(activeChatId);
      }
    }
  }, [activeChatId, chats]);

  const fetchChats = async () => {
    try {
      const userChats = await getUserChats();
      setChats(userChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const chatMessages = await getChatMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const message = await sendMessage(selectedChat._id, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Update chat's last message in the list
      setChats(prev => prev.map(chat => 
        chat._id === selectedChat._id 
          ? { ...chat, lastMessage: newMessage, lastMessageTime: new Date() }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user._id);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats.length === 0 ? (
          <div className="no-chats">No conversations yet</div>
        ) : (
          chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            return (
              <div 
                key={chat._id} 
                className={`message ${selectedChat?._id === chat._id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <img
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                />
                <div className="messageContent">
                  <span>{otherUser?.username || 'Unknown User'}</span>
                  <p>{chat.lastMessage || 'No messages yet'}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {selectedChat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
              />
              {getOtherParticipant(selectedChat)?.username || 'Unknown User'}
            </div>
            <span className="close" onClick={() => setSelectedChat(null)}>X</span>
          </div>
          <div className="center">
            {messages.map((message) => (
              <div 
                key={message._id} 
                className={`chatMessage ${message.senderId._id === user._id ? 'own' : ''}`}
              >
                <p>{message.content}</p>
                <span>{formatTime(message.createdAt)}</span>
              </div>
            ))}
          </div>
          <div className="bottom">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
