import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { postsClass } from "./Profile.module.css";

function Profile() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const userId = useParams().userId;

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:3000/users/${userId}`);
                const json = await res.json();
                setUser(json);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();

    }, [])

    return (
        <div>
            { isLoading && <h2>Loading...</h2> }
            { error && <h2>Error</h2> }

            { user && <h1>{user.username}'s Profile</h1> }
            
            <div className={ postsClass }>
                { user && (user.posts.length !== 0) && <h2>Posts</h2> }

                { user && <Link to="/posts/new">New post</Link>}

                { user && user.posts && user.posts.map(post =>
                    <ul key={post.id}>
                        <li><Link to={`/users/${post.authorId}/${post.id}`}>{post.title}</Link></li>
                        <li>{new Date(post.createdAt).toUTCString()}</li>
                        <li>{post.text}</li>
                    </ul>
                ) }

                { user && (user.comments.length !== 0) && <h2>Comments</h2> }
                { user && user.comments && user.comments.map(comment =>
                    <ul key={comment.id}>
                        <li>{comment.author.username}</li>
                        <li>{new Date(comment.createdAt).toUTCString()}</li>
                        <li>{comment.text}</li>
                    </ul>
                ) }
            </div>
        </div>
    );
};

export default Profile;