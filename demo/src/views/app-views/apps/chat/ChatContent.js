import React from 'react'
import { Route, Routes, Link} from 'react-router-dom';
import Conversation from './Conversation';
import { Button} from 'antd';

const ConversationEmpty = () => (
  <div className="chat-content-empty">
    <div className="text-center">
      <img src="/img/others/img-11.png" alt="Start a Conversation" />
      <Link to="/app/apps/chat/1"><Button >Start a conversation</Button></Link>
    </div>
  </div>
)

const ChatContent = () => {
  var sessionId = "" + Math.floor(Math.random() * 300010)
  return (
    <Routes>
      <Route path={`:id`} element={<Conversation sessionId={sessionId}/>} />
      <Route path={`/`} element={<ConversationEmpty />} />
    </Routes>
  )
}

export default ChatContent
