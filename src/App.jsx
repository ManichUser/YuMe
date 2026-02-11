import { useState, useEffect } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  )

  return (
    <div className="app">
      {isLoggedIn ? (
        <Chat onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  )
}


export default App
