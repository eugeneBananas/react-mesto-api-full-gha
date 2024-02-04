import React, { useState, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";

const AddPlacePopup = (props) => {
  const [value, setValue] = useState({});

  React.useEffect(() => {
    setValue(() => ({
      title: "",
      link: "",
    }));
  }, [props.isOpen]);

  const handleChange = (name) => (evt) => {
    const key = name;
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
    props.onAddCardPlace(value);
  }

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      children={
        <>
          <input
            type="text"
            pattern=".\S+."
            id="popup__title"
            placeholder="Название"
            className="popup__input popup__input_enter_title"
            name="popup-add__input-title"
            value={value.title}
            onChange={handleChange("title")}
            minLength="2"
            maxLength="30"
            required
          />
          <span className="popup__error popup__title-error"></span>
          <input
            type="url"
            pattern=".\S+."
            id="popup__link"
            placeholder="Ссылка на картинку"
            className="popup__input popup__input_enter_link"
            name="popup-add__input-link"
            value={value.link}
            onChange={handleChange("link")}
            required
          />
          <span className="popup__error popup__link-error"></span>
        </>
      }
      buttonText="Создать"
    />
  );
};

export default AddPlacePopup;
