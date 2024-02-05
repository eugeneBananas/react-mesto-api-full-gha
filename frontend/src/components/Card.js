import React from "react";
import { UserContext } from "../contexts/CurrentUserContext.js";

class Card extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDeleteClick = () => {
    this.props.onDeleteCard(this.props.card);
    // this.props.onCardDelete(this.props.card)
  };

  handleClick = () => {
    this.props.onCardClick(this.props.card);
  };

  isLiked = () => {
    // console.log(this.props.card)
    return this.props.card.likes.some((i) => i === this.context._id);
  };

  handleLike = () => {
    this.props.onCardLike(
      this.props.card,
      this.context,
      this.props.changeCards
    );
  };

  render() {
    return (
      <div className="elements__element">
        <div
          className="elements__image"
          style={{ backgroundImage: `url(${this.props.card.link})` }}
          onClick={this.handleClick}
        ></div>
        {this.props.card.owner === this.context._id && (
          <button
            type="button"
            onClick={this.handleDeleteClick}
            className={`elements__trash`}
          ></button>
        )}
        <div className="elements__rectangle">
          <h2 className="elements__text">{this.props.card.name}</h2>
          <div className="elements__like-container">
            <button
              type="button"
              className={`elements__heart ${
                this.isLiked() && "elements__heart_active"
              }`}
              onClick={this.handleLike}
            ></button>
            <p className="elements__likes">{this.props.card.likes.length}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
