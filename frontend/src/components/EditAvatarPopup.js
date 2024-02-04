import React, { useEffect, useState, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";

const EditProfilePopup = (props) => {
  const avatarRef = React.useRef();
  const [avatar, setAvatar] = useState("");

  React.useEffect(() => {
    setAvatar('');
  }, [props.isOpen]); 

  const handleChange = () => {
    setAvatar(avatarRef.current.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      avatar,
    });
  }

  return (
    <PopupWithForm
      name="vary"
      onSubmit={handleSubmit}
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose={props.onClose}
      children={
        <>
          <input
            ref={avatarRef}
            type="url"
            pattern=".\S+."
            id="popupurl"
            placeholder="Ссылка на картинку"
            className="popup__input popup__input_enter_url"
            name="popup-vary__input-url"
            value={avatar}
            onChange={handleChange}
            required
          />
          <span className="popup__error popup__url-error"></span>
        </>
      }
      buttonText="Создать"
    />
  );
};

export default EditProfilePopup;
