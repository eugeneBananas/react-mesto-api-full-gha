import React, { useState, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";

const DeleteCardPopup = (props) => {
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onDeleteCard(props.card);
  }

  return (
    <PopupWithForm
      name="delete"
      title="Вы уверены?"
      onClose={props.onClose}
      isOpen={props.isOpen}
      onSubmit={handleSubmit}
      children={<></>}
      buttonText="Да"
    />
  );
};

export default DeleteCardPopup;
