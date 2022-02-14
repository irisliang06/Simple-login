import React, {useContext, useState} from 'react';
import LoginContext, {LoginProvider} from './LoginContext';

/*

if the page is loading, just show <div>Loading...</div>

if the user is not logged in, show them a page with:
  input for username
  input for password
  button for login
  button for signup

if the user is logged in, show them a page with:
  hello, {username}
  button for logout

*/

function Home() {
  const { isLoading, username, isLoggedIn, login, logout, signup } = useContext(LoginContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  if(isLoading){
    return (<div>Loading...</div>);
  }
  else if (isLoggedIn) {
    return (
      <div>
        <div> Hello, {username}</div>
        <button onClick={logout}>Logout</button>
      </div>
    )
  }
  else {
     return (
        <div>
          <input type="text" value={usernameInput} onChange={(e)=>setUsernameInput(e.target.value)} />
          <input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/>
          <button onClick={() => login(usernameInput, passwordInput)}>Login</button>
          <button onClick={() => signup(usernameInput, passwordInput)}>Sign up</button>
        </div>
     )
  }
}

function App() {
  return (
    <LoginProvider>
      <Home/>
    </LoginProvider>
  );
}

export default App;
