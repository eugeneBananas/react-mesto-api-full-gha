import React, { useEffect, useState, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";
import { UserContext } from "../contexts/CurrentUserContext.js";

const EditProfilePopup = (props) => {
  const userContext = useContext(UserContext);
  const [value, setValue] = useState({});

  React.useEffect(() => {
    setValue(() => ({
      name: userContext.name,
      status: userContext.about,
    }));
  }, [userContext]);

  const handleChange = (str) => (evt) => {
    const key = str;
    const val = evt.target.value;
    setValue((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser(value);
  }

  return (
    <PopupWithForm
      name="edit"
      onSubmit={handleSubmit}
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      children={
        <>
          <input
            type="text"
            pattern=".*\S+.*"
            id="popup__name"
            placeholder="Имя"
            className="popup__input popup__input_enter_name"
            name="popup-edit__input-name"
            value={value.name}
            onChange={handleChange("name")}
            minLength="2"
            maxLength="40"
            required
          />
          <span className="popup__error popup__name-error"></span>
          <input
            type="text"
            pattern=".*\S+.*"
            id="popup__status"
            placeholder="Статус"
            className="popup__input popup__input_enter_status"
            name="popup-edit__input-status"
            value={value.status}
            onChange={handleChange("status")}
            minLength="2"
            maxLength="200"
            required
          />
          <span className="popup__error popup__status-error"></span>
        </>
      }
      buttonText="Сохранить"
    />
  );
};

export default EditProfilePopup;
