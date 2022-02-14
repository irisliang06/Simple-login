import React, {useState, useEffect} from 'react';

const LoginContext = React.createContext();

const URL = "http://localhost:5000";

export function LoginProvider({children}) {
    /*
    we wanna do all our rest api requests in this component
    1. when the component FIRST loads, request /is-login to find out if we're already logged in
    2. make the function login(username, password) that calls rest api /login
    3. make the function signup(username, password) that call rest api /signup
    4. make the function logout() that calls rest api /logout
    */

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(undefined);
    const [username, setUsername] = useState(undefined);

    /*
    1. When the component first loads:
    request /is-login, if it returns the username, set isLoggedIn to true and username to the username
    if it returns false, set isLoggedIn to false
    */
    async function onFirstLoad() {
        //fetch GET /is-login
        //get the json response, see if it is either false or a string
        let res = await fetch(`${URL}/is-login`);
        let val = await res.json();
        if(val === false){
            setIsLoggedIn(false);
        }else{
            setIsLoggedIn(true);
            setUsername(val);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        onFirstLoad();
    }, []);

    async function login(username, password) {
        /*
        do a POST request to /login
        with body: { username, password }
        if response is 200 OK, set isLoggedIn to true, and set username to username
        if response is 400, set isLoggedIn to false
        */
        let res = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if(res.ok){
            setIsLoggedIn(true);
            setUsername(username);
        }
        else {
            setIsLoggedIn(false);
        }
    }

    async function signup(username, password) {
        let res = await fetch(`${URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if(res.ok){
            setIsLoggedIn(true);
            setUsername(username);
        }
        else {
            setIsLoggedIn(false);
        }
    }

    async function logout() {
        await fetch(`${URL}/logout`);
        setIsLoggedIn(false);
    }

    //
  return (
    <LoginContext.Provider value={{ isLoading, isLoggedIn, username, login, logout, signup }}>
      {children}
    </LoginContext.Provider>
  )
}

export default LoginContext;

