import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginAPI from "../utils/LoginAPI";

function Register(props) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

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
    console.log(formValue.email, formValue.password);
    props.onRegister(formValue.email, formValue.password);
  };

  return (
    <>
      <section className="authorization">
        <p className="authorization__title">Регистрация</p>
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
            Зарегистрироваться
          </button>
        </form>
        <Link to="/sign-in" className="authorization__link">
          Уже зарегистрированы? Войти
        </Link>
      </section>
    </>
  );
}

export default Register;
