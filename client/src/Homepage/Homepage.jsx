import { Link } from 'react-router-dom';
import { homepage } from "./Homepage.module.css";

function App() {
  
  return (
    <div className={homepage}>
      <h1>Blog!</h1>
      <Link to="/posts">All Posts</Link>
      <Link to="/posts/new">New Post</Link>
    </div>
  )
}

export default App
