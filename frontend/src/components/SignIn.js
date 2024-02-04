import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserState } from "../contexts/IsUserLoggedIn.js";
import loginAPI from "../utils/LoginAPI";

function Login(props) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const userStatement = useContext(UserState);
  const navigate = useNavigate();

  const handleChange = (inputName) => (e) => {
    const name = inputName;
    const value = e.target.value;

    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onLogin(formValue.email, formValue.password);
  };

  return (
    <>
      <section className="authorization">
        <p className="authorization__title">Вход</p>
        <form onSubmit={handleSubmit} className="authorization__form">
          <input
            className="authorization__input"
            type="email"
            pattern=".*\S+.*"
            id="authorization__email"
            placeholder="Email"
            name="authorization__input-email"
            onChange={handleChange("email")}
            value={formValue.email}
            minLength="3"
            maxLength="64"
            required
          />
          <input
            className="authorization__input"
            type="password"
            id="authorization__password"
            placeholder="Пароль"
            name="authorization__input-password"
            onChange={handleChange("password")}
            value={formValue.password}
            required
          />
          <button
            type="submit"
            className="authorization__button"
            name="authorization__input-button"
          >
            Войти
          </button>
        </form>
      </section>
    </>
  );
}

export default Login;
