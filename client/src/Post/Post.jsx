import { useState, useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { content, editForm, buttons, title, textarea } from "./Post.module.css"

function Edit({ post, setEdit, setPost }) {

    const [input, setInput] = useState({title: post.title, text: post.text});
    const [submit, setSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const params = useParams();
    const userId = params.userId;
    const postId = params.postId;

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]: value})
    };

    function handleSubmit(e) { 
        e.preventDefault();
        setSubmit(true);
    };

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const data = JSON.stringify(input);
                const token = localStorage.token;
                const res = await fetch(`http://localhost:3000/users/${userId}/${postId}`, {
                    method: "PUT",
                    body: data,
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
                });
                setEdit(false);
                const json = await res.json();
                setPost({ ...post, title: json.title, text: json.text });

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if(submit) {
            setError(null);
            fetchData();
            setSubmit(false);
        }
    }, [submit]);

    return(
            <form onSubmit={handleSubmit} className={editForm}>
                <input className={title} type="text" id="title" name="title" required value={input.title} onChange={handleChange} />
                <ul>
                    <li>{post.author.username}</li>
                    <li>{new Date(post.createdAt).toUTCString()}</li>
                </ul>
                <textarea className={textarea} id="text" name="text" required value={input.text} onChange={handleChange} cols="35" rows="5"></textarea>
                { isLoading && <h2>Loading...</h2> }
                { error && <h2>Error</h2> }
                <div className={buttons}>
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                    <button onClick={() => setEdit(false)}>Cancel</button>
                </div>
            </form>
    )
};

function Comment({ setComment, post, setPost, method, comment }) {

    let temp = "";
    if (comment) temp = comment.text
    const [commentValue, setCommentValue] = useState(temp);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submit, setSubmit] = useState(false);

    const userId = useParams().userId;
    const postId = useParams().postId;

    function handleChange(e) {
        setCommentValue(e.target.value);
    };

    function handleSubmit(e) { 
        e.preventDefault();
        setSubmit(true);
    };

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const data = JSON.stringify({ text: commentValue });
                const token = localStorage.token;
                let url;
                (method === "POST") ? url = "newcomment" : url = comment.id.toString();
                const res = await fetch(`http://localhost:3000/users/${userId}/${postId}/${url}`, {
                    method: method,
                    body: data,
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
                });
                setComment(false);
                const json = await res.json();

                if (comment) {
                    const newPost = {...post}
                    newPost.comments = newPost.comments.map(c => {
                        if (c === comment) c.text = json.text;
                        return c;
                    });
                    console.log(newPost)
                    setPost( newPost );
                } else setPost({ ...post, comments: [...post.comments, json] });

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (submit) {
            setError(null);
            fetchData();
            setSubmit(false);
        };
    }, [submit])
    
    return (
        <form onSubmit={handleSubmit}>
            <textarea type="text" name="text" required value={commentValue} onChange={handleChange} cols="35" rows="5"></textarea>
            { isLoading && <h2>Loading...</h2> }
            { error && <h2>Error</h2> }
            <div className={buttons}>
                <button type="submit" onClick={handleSubmit}>Submit</button>
                <button onClick={() => setComment(false)}>Cancel</button>
            </div>
        </form>
    )
}

function Post() {

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useOutletContext();
    
    const userId = useParams().userId;
    const postId = useParams().postId;
    
    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);
    
    const [comment, setComment] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [removeComment, setRemoveComment] = useState(false);
        
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
        setEdit(true);
    };

    function handleDelete() {
        setRemove(true);
    };

    // Delete post
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const token = localStorage.token;
                const res = await fetch(`http://localhost:3000/users/${userId}/${postId}`, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + token }
                });
                const json = await res.json();
                setRemove(json);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if(remove === true) {
            setError(null);
            fetchData();
        }

    }, [remove]);

    function handleComment() {
        setComment(true);
    }

    function handleCommentEdit(id) {
        setEditComment(id);
    }

    function handleCommentDelete(id) {
        setRemoveComment(id);
    }

    // Delete comments
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const token = localStorage.token;
                await fetch(`http://localhost:3000/users/${userId}/${postId}/${removeComment}`, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + token }
                });
                const newPost = {...post};
                newPost.comments = newPost.comments.filter(c => c.id !== removeComment);
                setPost(newPost);
                setRemoveComment(true);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if(typeof(removeComment) === "number") {
            setError(null);
            fetchData();
        }

    }, [removeComment]);


    return (
        <>
            { isLoading && <h2>Loading...</h2> }
            { error && <div>Error</div> }

            { edit && 
                <Edit post={ post } setEdit={ setEdit } setPost={ setPost }/>
            }

            { remove && (remove !== true) && 
                <div>
                    <h1>Post removed!</h1>
                    <Link to={`/users/${userId}`}>Back to user posts</Link>
                </div>
            }

            { !remove && !edit && post && 
                <div className={content}>
                    <h1 className={title}>{post.title}</h1>
                    <ul>
                        <li>{post.author.username}</li>
                        <li>{new Date(post.createdAt).toUTCString()}</li>
                        <li>{post.text}</li>
                    </ul>

                    { user && user.username === post.author.username && 
                        <div className={ buttons }>
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    }

                    <div>
                        { user &&
                            <>
                                <h2>Comments</h2>
                                { comment && <Comment setComment={setComment} post={post} setPost={setPost} method={"POST"} comment={null}/> }
                                { !comment && <button onClick={handleComment}>New Comment</button> }
                                
                            </>
                        }

                        { removeComment && <h3>Comment removed!</h3> }
                        
                        { (post.comments.length > 0) &&
                            <>
                                { !user && <h2>Comments</h2> }
                                {post.comments.map(comment => (
                                    <ul key={comment.id}>
                                        <li>{comment.author}</li>
                                        <li>{new Date(comment.createdAt).toUTCString()}</li>
                                            
                                        {editComment === comment.id 
                                                ? <Comment setComment={setEditComment} post={post} setPost={setPost} method={"PUT"} comment={comment}/> 
                                                : <li>{comment.text}</li>
                                        }

                                        { !editComment && user && user.username === comment.author &&
                                            <div className={ buttons }>
                                                <button onClick={() => handleCommentEdit(comment.id)}>Edit</button>
                                                <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
                                            </div>                                        
                                        }
                                    </ul>
                                ))}
                            </>
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default Post;