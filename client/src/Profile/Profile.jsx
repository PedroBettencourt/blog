import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
                const res = await fetch(`http://localhost:3000/users/${userId}`, { headers: { "Authorization": "Bearer " + localStorage.token } });
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
            { isLoading && <div>Loading...</div> }
            { error && <div>Error</div> }

            { user && <h1>{user.username}'s Profile</h1> }
            
            <div className={ postsClass }>
                { user && user.posts && user.posts.map(post => (
                    <ul key={post.id}>
                        <li>{post.title}</li>
                        <li>{new Date(post.createdAt).toUTCString()}</li>
                        <li>{post.text}</li>
                        {(user.id === 6) && <li>hi</li>}
                    </ul>
                ))}
            </div>
            {console.log(user)}
        </div>
    );
};

export default Profile;