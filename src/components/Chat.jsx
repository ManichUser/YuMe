import { useEffect, useState, useRef } from 'react'
import { connectSocket } from '../services/socket'
import API from '../services/api'
import EmojiPicker from 'emoji-picker-react'
import Message from './Message'
import './Chat.css'

export default function Chat({ onLogout }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const socketRef = useRef(null)
  const scrollRef = useRef(null)
  const [currentUser, setCurrentUser] = useState({ id: 0, email: '' })

  useEffect(() => {
    const init = async () => {
      const res = await API.get('/messages')
      setMessages(res.data)

      const userRes = await API.get('/protected')
      
      setCurrentUser({ id: userRes.data.id, email: userRes.data.email })

      scrollToBottom()
    }
    init()

    socketRef.current = connectSocket()
    if (!socketRef.current) return

    socketRef.current.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg])
      scrollToBottom()
    })

    return () => socketRef.current.disconnect()
  }, [])

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const sendMessage = () => {
    if (!input.trim()) return
    if (socketRef.current) {
      socketRef.current.emit('send_message', { content: input })
    }
    setInput('')
  }

  const addEmoji = (emojiObj) => {
    setInput(prev => prev + emojiObj.emoji)
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat privé</h2>
        <button onClick={() => { localStorage.removeItem('token'); onLogout() }}>
          Déconnexion
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} currentUser={currentUser} />
        ))}
        <div ref={scrollRef}></div>
      </div>

      <div className="chat-input-wrapper">
        {showEmoji && <div className="emoji-picker-container"><EmojiPicker onEmojiClick={addEmoji} /></div>}
        <div className="chat-input">
          <button className="emoji-btn" onClick={() => setShowEmoji(prev => !prev)}>😀</button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Tapez un message..."
          />
          <button className="send-btn" onClick={sendMessage}>Envoyer</button>
        </div>
      </div>
    </div>
  )
}
