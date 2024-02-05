const { default: mongoose } = require('mongoose');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const Card = require('../models/card');

const HTTP_STATUS = {
  CREATED: 201,
};

// module.exports.getCards = (req, res, next) => {
//   Card.find({})
//     // .then((cards) => res.send({ data: cards }))
//     .then((cards) => res.send(cards))
//     .catch((err) => {
//       next(err);
//     });
// };

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      const reversedCards = cards.reverse();
      res.send(reversedCards);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      // console.log(card.owner);
      res.status(HTTP_STATUS.CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        next(new ForbiddenError('Нельзя удалить карточку другого пользователя'));
      }
      Card.deleteOne(card)
        .then(() => {
          res.send({ data: card });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(err.message));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(err.message));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(err.message));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};
