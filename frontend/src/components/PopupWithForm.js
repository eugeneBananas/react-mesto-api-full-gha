import React from "react";

class PopupWithForm extends React.Component {
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
          className={`popup popup_action_${this.props.name} 
            ${this.props.isOpen ? "popup_opened" : ""}`}
          onClick={this.handleOverlay}
        >
          <div className="popup__container">
            <h2 className="popup__text">{this.props.title}</h2>
            <form
              onSubmit={this.props.onSubmit}
              className="popup__form"
              name={`popup-${this.props.name}`}
              noValidate
            >
              {this.props.children}
              <button
                type="submit"
                className="popup__button"
                name={`popup-${this.props.name}__input-button`}
              >
                {this.props.buttonText}
              </button>
            </form>
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

export default PopupWithForm;
