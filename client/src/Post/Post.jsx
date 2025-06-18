import { useState, useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { postEdit } from "./Post.module.css"


function Post() {

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useOutletContext();

    const userId = useParams().userId;
    const postId = useParams().postId;

    const [text, setText] = useState("");

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:3000/users/${userId}/${postId}`);
                const json = await res.json();
                setPost(json);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, []);

    function handleEdit() {
        return (
            <div>
                {console.log("edit")}
                <p>Hi</p>
                <label htmlFor="text">Text</label>
                <input type="text" id="text" name="text" value={text}/>
            </div>
        )
    };

    function handleDelete() {
        console.log("delete")
    };

    return (
        <>
            { isLoading && <div>Loading...</div> }
            { error && <div>Error</div> }

            { post && 
                <div>
                    <h1>{post.title}</h1>
                    <ul>
                        <li>{post.author.username}</li>
                        <li>{new Date(post.createdAt).toUTCString()}</li>
                        <li>{post.text}</li>
                    </ul>
                    { user && user.username === post.author.username && 
                        <div className={ postEdit }>
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    }

                    { (post.comments.length > 0) &&
                        <div>
                            <h2>Comments</h2>
                            {post.comments.map(comment => (
                                <ul key={comment.id}>
                                    <li>{comment.author}</li>
                                    <li>{new Date(comment.createdAt).toUTCString()}</li>
                                    <li>{comment.text}</li>
                                </ul>
                            ))}
                        </div>
                    }
                </div>
            }
        </>
    );
};

export default Post;