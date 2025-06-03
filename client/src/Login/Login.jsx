import { useEffect, useState } from "react";
import { Link } from "react-router";
import { login, mistake, label } from "./Login.module.css";

function Login() {
    const [input, setInput] = useState({ username: "", password: "" });
    const [submit, setSubmit] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]: value});
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
                    const res = await fetch(
                        "http://localhost:3000/login",
                        { 
                            method: "POST", 
                            body: data, 
                            headers: {"Content-Type": "application/json"} 
                        });
                    const json = await res.json();
                setResponse(json);

                // Set token in local storage
                if (json.token) {
                    localStorage.setItem("token", json.token);
                }

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (submit) {
            setError(null);
            setResponse(null);
            fetchData();
            setSubmit(false);
        };

    }, [submit]);
    
    return (
        <div className={ login }>
            <h1>Login</h1>
            { (isLoading) && <div>Loading...</div> }
            { // FIX THE ERROR PART
            console.log(error)}
            { (error) && <div>Problem</div>}


            { (response) && (response.message) && 
                <ul>
                    <li className={ mistake }>{response.message}</li> 
                </ul>
            }

            { (response) && (response.token) && 
                <li><span style={{fontWeight: "bold"}}>{input.username}</span> is now logged in!</li>
            }

            { (!response || !response.token)  &&
                <form onSubmit={handleSubmit}>
                    <div className={ label }>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required value={input.username} onChange={handleChange} />
                    </div>
                    <div className={ label }>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required value={input.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Login</button>
                </form>
            }

            <Link to="/">Return to Homepage</Link>
        </div>
    );
};

export default Login;