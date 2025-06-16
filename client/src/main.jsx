import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Posts from './Posts/Posts.jsx';
import NewPost from './NewPost/NewPost.jsx';
import Register from './Register/Register.jsx';
import Login from './Login/Login.jsx';
import Profile from './Profile.jsx';
// import ProfilePosts from './ProfilePosts.jsx';
// import ProfileComments from './ProfileComments.jsx';
import Post from './Post.jsx';

const router = createBrowserRouter([
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
  // {
  //   path: "/users/:userId/posts",
  //   element: <ProfilePosts />,
  // },
  // {
  //   path: "/users/:userId/comments",
  //   element: <ProfileComments />,
  // },
  {
    path: "users/:userId/:postId",
    element: <Post />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
