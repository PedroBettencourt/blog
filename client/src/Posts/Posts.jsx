import { useEffect, useState } from "react";
import { postsClass } from "./Posts.module.css";
import { Link } from "react-router-dom";

function Posts() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const res = await fetch("http://localhost:3000/posts");
                const json = await res.json();
                setPosts(json);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();

    }, [])

    return (
        <div>
            <h1>Posts</h1>
            { (isLoading) && <h2>Loading...</h2> }
            { (error) && <h2>Error</h2> }

            <Link to="/posts/new">New post</Link>
            {console.log(posts)}

            <div className={ postsClass }>
                { (posts) && posts.map(post =>
                    <ul key={post.id}>
                        <li><Link to={`/users/${post.author.id}/${post.id}`}>{post.title}</Link></li>
                        <li>{post.author.username}</li>
                        <li>{new Date(post.createdAt).toUTCString()}</li>
                        <li>{post.text}</li>
                    </ul>
                ) }
            </div>
        </div>
    )
}

export default Posts;