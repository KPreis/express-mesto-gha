const Card = require('../models/card');
const {
  BAD_REQUEST_CODE,
  PAGE_NOT_FOUND_CODE,
  COMMON_ERROR_CODE,
} = require('../consts/error_codes');

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  const owner = req.user._id;

  Card.create({
    name, link, owner,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при создании карточки' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(COMMON_ERROR_CODE).send({ message: 'Произошла ошибка при поиске карточек' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card != null) {
        res.send({ data: card });
      } else {
        const error = new Error(
          `Карточка с указанным _id ${req.params.cardId} не найдена`,
        );
        error.name = 'CardNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(PAGE_NOT_FOUND_CODE).send({ message: `${err.message}` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при удалении карточки',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при удалении карточки по ID' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card != null) {
        res.send({ data: card });
      } else {
        const error = new Error(
          `Передан несуществующий _id ${req.params.cardId} карточки`,
        );
        error.name = 'CardNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(PAGE_NOT_FOUND_CODE).send({ message: `${err.message}` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при установке лайка карточке' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card != null) {
        res.send({ data: card });
      } else {
        const error = new Error(
          `Передан несуществующий _id ${req.params.cardId} карточки`,
        );
        error.name = 'CardNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(PAGE_NOT_FOUND_CODE).send({ message: `${err.message}` });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }
      res
        .status(COMMON_ERROR_CODE)
        .send({ message: 'Произошла ошибка при удалении лайка карточки' });
    });
};
