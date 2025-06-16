import { useEffect, useState } from "react";
import { postsClass } from "./Posts.module.css";

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
            { (isLoading) && <div>Loading...</div> }
            { (error) && <div>Error</div> }

            <div className={ postsClass }>
                { (posts) && posts.map(post =>
                    <ul key={post.id}>
                        <li>{post.title}</li>
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