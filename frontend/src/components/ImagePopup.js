import React from "react";

class ImagePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOverlay = (evt) => {
    if (evt.target.classList.contains("popup")) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <>
        <section
          className={`popup popup_action_depict ${
            this.props.card._id ? "popup_opened" : ""
          }`}
          onClick={this.handleOverlay}
        >
          <div className="popup__filling">
            <img
              src={this.props.card.link}
              alt="Изображение"
              className="popup__illustration"
            />
            <h2 className="popup__hint">{this.props.card.name}</h2>
            <button
              type="button"
              className="popup__cross"
              onClick={this.props.onClose}
            ></button>
          </div>
        </section>
      </>
    );
  }
}

export default ImagePopup;
