import React, { useState, Link, useEffect, useContext } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import Login from "./SignIn.js";
import Register from "./SignUp.js";
import Profile from "./Profile.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import DeleteCardPopup from "./DeleteCardPopup.js";
import AddCardPopup from "./AddPlacePopup.js";
import InfoTooltip from "./InfoTooltip.js";
import api from "../utils/api.js";
import loginAPI from "../utils/LoginAPI";
import ProtectedRouteElement from "./ProtectedRoute.js";
import { UserContext } from "../contexts/CurrentUserContext.js";
import { UserState } from "../contexts/IsUserLoggedIn.js";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [preparedForDeleteCard, setPreparedForDeleteCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [registerStatus, setRegisterStatus] = useState({
    isOpen: false,
    isSuccessful: false,
  });
  const isOpen =
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isEditAvatarPopupOpen ||
    isDeleteCardPopupOpen ||
    selectedCard ||
    registerStatus.isOpen;

  const navigate = useNavigate();

  React.useEffect(() => {
    handleTokenCheck();
    
    if (loggedIn) {
      api
        .getProfileInfo()
        .then((info) => {
          setCurrentUser(info);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .loadCards()
        .then((initialCards) => {
          setCards(initialCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscClose = (evt) => {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => document.removeEventListener("keydown", handleEscClose);
  }, [isOpen]);

  const handleUpdateUser = (info) => {
    api
      .editProfile(info.name, info.status)
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateAvatar = (info) => {
    api
      .changeAvatar(info.avatar)
      .then(() => {
        setCurrentUser((prevState) => ({
          ...prevState,
          avatar: info.avatar,
        }));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlaceSubmit = (info) => {
    api
      .addCard(info.title, info.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkStatusRegister = () => {
    if (registerStatus.isSuccessful) navigate("/sign-in", { replace: true });
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setSelectedCard({});
    setPreparedForDeleteCard({});
    checkStatusRegister();
    setRegisterStatus({ isOpen: false, isSuccessful: false });
  };

  const handleCardClick = (value) => {
    setSelectedCard(value);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleDeleteCardClick = (value) => {
    setPreparedForDeleteCard(value);
    setIsDeleteCardPopupOpen(true);
  };

  const handleCardLike = (card, context, changeFunction) => {
    const isLiked = card.likes.some((i) => i._id === context._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        changeFunction((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((el) => el._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRegister = (email, password) => {
    loginAPI
      .signUpUser(email, password)
      .then(() => {
        {
          setRegisterStatus((values) => ({ ...values, isSuccessful: true }));
        }
      })
      .catch((err) => {
        console.log("Ошибка!: " + err);
      })
      .finally(() => {
        setRegisterStatus((values) => ({ ...values, isOpen: true }));
      });
  };

  const handleLogin = (email, password) => {
    loginAPI
      .signInUser(email, password)
      .then((data) => {
        setEmail(email);
        if (data.token) {
          setLoggedIn(true);
          localStorage.setItem("token", data.token);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        setRegisterStatus((values) => ({ ...values, isOpen: true }));
        console.log("Ошибка!: " + err);
      });
  };

  const handleTokenCheck = () => {
    if (localStorage.getItem("token")) {
      const jwt = localStorage.getItem("token");
      console.log(jwt);
      loginAPI.checkToken(jwt).then((res) => {
        setEmail(res.data.email);
        if (res) {
          setLoggedIn(true);
          navigate("/", { replace: true });
        }
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={currentUser}>
      <UserState.Provider value={loggedIn}>
        <Header email={email} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                element={
                  <>
                    <Main
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick}
                      onDeleteCard={handleDeleteCardClick}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      // onCardDelete={handleCardDelete}
                      cards={cards}
                      setCards={setCards}
                    />
                    <Footer />
                    <EditProfilePopup
                      isOpen={isEditProfilePopupOpen}
                      onClose={closeAllPopups}
                      onUpdateUser={handleUpdateUser}
                    />
                    <EditAvatarPopup
                      isOpen={isEditAvatarPopupOpen}
                      onClose={closeAllPopups}
                      onUpdateUser={handleUpdateAvatar}
                    />
                    <AddCardPopup
                      isOpen={isAddPlacePopupOpen}
                      onClose={closeAllPopups}
                      onAddCardPlace={handleAddPlaceSubmit}
                    />
                    <DeleteCardPopup
                      card={preparedForDeleteCard}
                      isOpen={isDeleteCardPopupOpen}
                      onClose={closeAllPopups}
                      onDeleteCard={handleCardDelete}
                    />
                    {/* Попап для картинок */}
                    <ImagePopup card={selectedCard} onClose={closeAllPopups} />
                  </>
                }
                // onEditProfile={handleEditProfileClick}
                // onAddPlace={handleAddPlaceClick}
                // onEditAvatar={handleEditAvatarClick}
                // onDeleteCard={handleDeleteCardClick}
                // onCardClick={handleCardClick}
                // onCardLike={handleCardLike}
                // cards={cards}
                // setCards={setCards}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <>
                <Login setStatus={setRegisterStatus} onLogin={handleLogin} />
                <InfoTooltip status={registerStatus} onClose={closeAllPopups} />
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Register
                  setStatus={setRegisterStatus}
                  onRegister={handleRegister}
                />
                <InfoTooltip status={registerStatus} onClose={closeAllPopups} />
              </>
            }
          />
        </Routes>
      </UserState.Provider>
    </UserContext.Provider>
  );
}
