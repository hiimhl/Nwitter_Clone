import React, { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

function Router() {
  const [isLoggendIn, setIsLoggedIn] = useState(false);
  return (
    <HashRouter>
      <Routes>
        {isLoggendIn ? (
          <>
            <Route path="/" element={<Home />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </HashRouter>
  );
}
export default Router;
