import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vacations from "./pages/Vacations";
import MyVacations from "./pages/MyVacations";
import AddVacation from './pages/AddVacation';
import EditVacation from "./pages/EditVacation";
import Vacation from "./pages/Vacation";
// Components
import Header from "./components/Header";

import { AuthContext } from "./shared/context/auth-context";
import { ROLE } from './shared/util/role';

let logoutTimer: ReturnType<typeof setTimeout>;

function App() {
  const [token, setToken] = useState<any>(null);
  const [userIdState, setUserIdState] = useState<any>();
  const [userRoleState, setUserRoleState] = useState<any>();
  const [tokenExpirationDate, setTokenExpirationDate] = useState<any>();
  
  const login = useCallback((uid, token, expirationDate, userRole) => {
	setToken(token);
    setUserIdState(uid);
    setUserRoleState(userRole);
    const tokenExpirationDateCalc = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDateCalc);
    localStorage.setItem(
        'userData', 
        JSON.stringify({
            userId: uid, 
            token: token, 
            expiration: tokenExpirationDateCalc.toISOString()
        }
    ));
  }, []);

  const logout = useCallback(() => {
	setToken(null);
    setTokenExpirationDate(null);
    setUserIdState(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if(token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
    } else {
        clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect (() => {
    const localStorageData = localStorage.getItem('userData');
    let storeData;
    if(localStorageData){
        storeData =  JSON.parse(localStorageData);
    }
    if(
        storeData && 
        storeData.token && 
        new Date(storeData.expiration) > new Date()
        ){
        login(storeData.userId, storeData.token, new Date(storeData.expiration), storeData.userRole);
    }
  }, [login]);

  let routes;
  
  if(token  && userIdState) {
	  routes = (
		<Switch>
		  <Route exact path="/vacations/" component={Vacations} />
		  <Route exact path="/vacations/:vacationId" component={Vacation} />
		  <Route exact path="/my-vacations" component={MyVacations} />
		  <Redirect to="/vacations" />
		</Switch>
	  );
      if(userRoleState === ROLE.admin){
        routes = (
		<Switch>
            <Route exact path="/vacations/" component={Vacations} />
            <Route exact path="/vacations/:vacationId" component={Vacation} />
            <Route exact path="/my-vacations" component={MyVacations} />
            <Route exact path="/vacations/:vacationId/edit" component={EditVacation} />
            <Route exact path="/add-vacation" component={AddVacation} />
    		<Redirect to="/vacations" />
		</Switch>

        );
      }
  } else {
	  routes = (
		<Switch>
		  <Route exact path="/" component={Login} />
		  <Route exact path="/login" component={Login} />
		  <Route exact path="/register" component={Register} />
		  <Redirect to="/" />
		</Switch>
	  );
  }
 
  return (
	<AuthContext.Provider
	  value={{ 
          isLoggedIn: !!token, 
          token: token,
          userId: userIdState,
          userRole: userRoleState,
          login: login, 
          logout: logout 
        }}
	>
	  <Router>
		<div className="App">
		  <Header />
		  <main className="main-wrapper">{routes}</main>
		</div>
	  </Router>
	</AuthContext.Provider>
  );
}

export default App;
