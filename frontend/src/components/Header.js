import React, { useContext } from "react";
import logo from "../images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { UserState } from "../contexts/IsUserLoggedIn.js";

function Header(props) {
  let location = useLocation();
  const userStatement = useContext(UserState);

  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Логотип" />
      {!userStatement && (location.pathname === "/sign-up" ? (
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      ) : (
        <Link to="/sign-up" className="header__link">
          Регистрация
        </Link>
      ))}
      {userStatement && (
        <div className="header__container">
          <p className="header__email">{props.email}</p>
          <Link to="/sign-in" onClick={props.onLogout} className="header__quit">
            Выйти
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
