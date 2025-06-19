import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, Link, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './Homepage/Homepage.jsx';
import Posts from './Posts/Posts.jsx';
import NewPost from './NewPost/NewPost.jsx';
import Register from './Register/Register.jsx';
import Login from './Login/Login.jsx';
import Profile from './Profile/Profile.jsx';
import Post from './Post/Post.jsx';

function Layout() {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.token) {
      async function fetchData() {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/protected`,
                          { 
                            headers: {"Authorization": `Bearer ${localStorage.token}`} 
                          }
            );
            const json = await res.json();
            setUser(json);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
      }
      fetchData();
    }
  }, [])
  
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          { user && <li><Link to={`/users/${user.id}`}>{user.username}</Link></li> }
          { isLoading && <li>Loading</li> }
          { !isLoading && (!user || error) && <li><Link to="/login">Login</Link></li> }
        </ul>
      </nav>
      <Outlet context={user} />
    </>
  )
}

function ErrorPage() {
  return (
    <>
      <p>This page does not exist</p>
      <Link to="/">Homepage</Link>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/posts/new",
        element: <NewPost />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/users/:userId",
        element: <Profile />,
      },
      {
        path: "users/:userId/:postId",
        element: <Post />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
