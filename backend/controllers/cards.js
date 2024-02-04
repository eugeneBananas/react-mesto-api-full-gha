const HTTP_STATUS = {
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(HTTP_STATUS.CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        const error = new Error('Введены некорректные данные');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
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
      if (!card.owner === req.user._id) {
        throw new Error('Нельзя удалить карточку другого пользователя');
      }
      Card.deleteOne(card)
        .then(() => {
          res.send({ data: card });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            const error = new Error('Введен некорректный ID');
            error.statusCode = HTTP_STATUS.BAD_REQUEST;
            next(error);
          } else if (err.message === 'NotFound') {
            const error = new Error('Ошибка при вводе данных пользователя');
            error.statusCode = HTTP_STATUS.NOT_FOUND;
            next(error);
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
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
        const error = new Error('Введен некорректный ID');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
      } else if (err.message === 'NotFound') {
        const error = new Error('Ошибка при вводе данных пользователя');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        next(error);
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
        const error = new Error('Введен некорректный ID');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
      } else if (err.message === 'NotFound') {
        const error = new Error('Ошибка при вводе данных пользователя');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        next(error);
      } else {
        next(err);
      }
    });
};
