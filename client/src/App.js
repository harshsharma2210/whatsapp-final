import "./App.css";
import { useStateValue } from "./StateProvider";
import React from "react";
import Sidebar from "./Sidebar";

import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Route exact path="/">
              <Chat />
            </Route>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
