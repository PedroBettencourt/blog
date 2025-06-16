import { useEffect, useState } from "react";
import { newPostClass, formClass } from "./NewPost.module.css";
import { Link } from "react-router-dom";

function NewPost() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [input, setInput] = useState({ title: "", text: "" });
    const [submit, setSubmit] = useState(null);
    const [response, setResponse] = useState(null);

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]: value})
    }

    function handleSubmit(e) { 
        e.preventDefault();
        setSubmit(true);
    }

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const data = JSON.stringify(input);
                const token = localStorage.token;
                const res = await fetch(
                    "http://localhost:3000/posts/new",
                    {
                        method: "POST",
                        body: data,
                        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
                    }
                );
                if (res.status === 401) setResponse(401);
                const json = await res.json();
            setResponse(json);

            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        
        if(submit) {
            setError(null)
            fetchData();
            setSubmit(false);
        }

    }, [submit])
        
    
    return (
        <div className={ newPostClass }>
            <h1>New Post</h1>
            
            { (isLoading) && <div>Loading...</div> }
            { (error) && <div>Error</div> }

            { (response) && (response === 401) && <Link to="/login">Login!</Link>}

            { (response) && (response !== 401) && 
                <div>
                    <p>Post created!</p>
                    <Link to="/">Back to the Homepage!</Link>
                </div>
            }

            { (!response || response === 401) && 
                <form onSubmit={handleSubmit}>
                    <div className={formClass}>
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" required value={input.title} onChange={handleChange} />
                    </div>
                    <div className={formClass}>
                        <label htmlFor="text">Text:</label>
                        <textarea id="text" name="text" required value={input.text} onChange={handleChange} cols="35" rows="5"></textarea>
                    </div>
                    <div>
                        <label htmlFor="published">Published:</label>
                        <input type="checkbox" id="published" name="published" />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            }

            
        </div>
    );
};

export default NewPost;