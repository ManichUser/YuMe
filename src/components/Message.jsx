import React from 'react'
import './Message.css'

export default function Message({ msg, currentUser }) {
  const isMine = msg.sender_id === currentUser.id
  return (
    <div className={`message ${isMine ? 'mine' : 'theirs'}`}>
      <div className="sender-name">{msg.sender_email}</div> 
      <div className="message-content">{msg.content}</div>
    </div>
  )
}