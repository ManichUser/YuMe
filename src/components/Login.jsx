import { useState } from 'react'
import API from '../services/api'
import './Login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // ✅ loader

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)  // début du loading
    setError('')      // reset error
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      onLogin()
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false) // fin du loading
    }
  }

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form className='formconnect' onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading} // désactive pendant le loading
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading} // désactive pendant le loading
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
