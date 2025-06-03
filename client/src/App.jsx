import './App.css'
import { Link } from 'react-router-dom';

function App() {
  
  return (
    <>
      Blog!
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </>
  )
}

export default App
