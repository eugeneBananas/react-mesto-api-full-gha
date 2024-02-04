import React, { useContext, useEffect } from "react";
import Card from "./Card.js";
import { UserContext } from "../contexts/CurrentUserContext.js";

const Main = (props) => {
  const userContext = useContext(UserContext);

  return (
    <>
      <section className="profile">
        <div className="profile__block">
          <div className="profile__photo-container">
            <button
              className="profile__edit-avatar"
              style={{ backgroundImage: `url(${userContext.avatar})` }}
              onClick={props.onEditAvatar}
            ></button>
          </div>
          <div className="profile__info">
            <div className="profile__edit-name">
              <h1 className="profile__name">{userContext.name}</h1>
              <button
                type="button"
                className="profile__edit-button"
                onClick={props.onEditProfile}
              ></button>
            </div>
            <p className="profile__status">{userContext.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__add-button"
          onClick={props.onAddPlace}
        ></button>
      </section>

      <section className="elements">
        {props.cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
              onDeleteCard={props.onDeleteCard}
              changeCards={props.setCards}
            />
          );
        })}
      </section>
    </>
  );
};

export default Main;
