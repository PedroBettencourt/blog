import { useEffect, useState } from "react";
import { Link } from "react-router";
import { register, label, mistake } from "./Register.module.css";

function Register() {
    const [input, setInput] = useState({username: "", password: "", passwordRepeat: "", author: false});
    const [submit, setSubmit] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]: value});
    }

    function handleCheck(e) {
        const checked = e.target.checked;
        setInput({...input, author: checked});
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
                        "http://localhost:3000/register",
                        { 
                            method: "POST", 
                            body: data, 
                            headers: {"Content-Type": "application/json"} 
                        });
                    const json = await res.json();
                setResponse(json);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (submit) {
            setResponse(null)
            fetchData();
            setSubmit(false);
        };
    }, [submit])
    
    return (
        <div className={ register }>
            <h1>Register</h1>
            { (isLoading) && <div>Loading...</div> }
            { (error) && <div>{error}</div>}

            { (response) && (response.errors) && response.errors.map(error => <li className={ mistake }>{error.msg}</li>) }

            { (response) && (response.message) && 
                <ul>
                    <li>{response.message}</li> 
                    <li><Link to="/">Return to Homepage</Link></li>
                </ul>
            }

            <form onSubmit={handleSubmit}>
                <div className={ label }>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required value={input.username} onChange={handleChange} />
                </div>
                <div className={ label }>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required value={input.password} onChange={handleChange} />
                </div>
                <div className={ label }>
                    <label htmlFor="passwordRepeat">Repeat password</label>
                    <input type="password" id="passwordRepeat" name="passwordRepeat" required value={input.passwordRepeat} onChange={handleChange} />
                </div>
                <div className={ label }>
                    <label htmlFor="author">Author</label>
                    <input type="checkbox" id="author" name="author" value={input.author} onChange={handleCheck} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;