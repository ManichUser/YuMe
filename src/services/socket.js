import { io } from 'socket.io-client'

let socket = null

export const connectSocket = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token }
  })

  return socket
}

export const getSocket = () => socket
