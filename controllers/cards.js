const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createCard = (req, res, next) => {
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
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным _id ${req.params.cardId} не найдена`);
      }
      if (card.owner !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий _id ${req.params.cardId} карточки`);
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий _id ${req.params.cardId} карточки`);
      }
      res.send({ data: card });
    })
    .catch(next);
};
