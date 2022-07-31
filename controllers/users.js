const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res
        .status(500)
        .send({ message: 'Произошла ошибка при создании пользователя' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка при поиске пользователей' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user != null) {
        res.send({ data: user });
      } else {
        const error = new Error(
          `Пользователь по указанному _id: ${req.params.userId} не найден.`,
        );
        error.name = 'UserNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(404).send({ message: `${err.message}` });
        return;
      }
      res
        .status(500)
        .send({ message: 'Произошла ошибка при поиске пользователя по ID' });
    });
};

// updateUserProfile, updateUserAvatar

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user != null) {
        res.send({ data: user });
      } else {
        const error = new Error(
          `Пользователь по указанному _id: ${userId} не найден.`,
        );
        error.name = 'UserNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(404).send({
          message: `${err.message}`,
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res
        .status(500)
        .send({ message: 'Произошла ошибка при изменении профиля' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user != null) {
        res.send({ data: user });
      } else {
        const error = new Error(
          `Пользователь по указанному _id: ${userId} не найден.`,
        );
        error.name = 'UserNotFound';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(404).send({
          message: `${err.message}`,
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      res
        .status(500)
        .send({ message: 'Произошла ошибка при изменении аватара' });
    });
};
