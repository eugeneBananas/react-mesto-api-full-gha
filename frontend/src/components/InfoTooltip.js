import confirmedSymbol from "../images/log_in_confirmed.svg";
import notConfirmedSymbol from "../images/log_in_not_confirmed.svg";

function InfoTooltip(props) {
  const handleOverlay = (evt) => {
    if (evt.target.classList.contains("popup")) {
      props.onClose();
    }
  };

  return (
    <>
      <section
        className={`popup popup_action_verify ${
          props.status.isOpen ? "popup_opened" : ""
        }`}
        onClick={handleOverlay}
      >
        <div className="popup__container">
          <img
            src={
              props.status.isSuccessful ? confirmedSymbol : notConfirmedSymbol
            }
            className="popup__verify"
            alt="verify image"
          />
          <p className="popup__status-text">
            {props.status.isSuccessful
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </p>
          <button
            type="button"
            className="popup__cross"
            onClick={props.onClose}
          ></button>
        </div>
      </section>
    </>
  );
}

export default InfoTooltip;
