const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.send(
            {
              _id: user._id,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          );
        })
        .catch(next);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному _id: ${req.user._id} не найден.`);
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден.`);
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
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
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному _id: ${userId} не найден.`);
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
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
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному _id: ${userId} не найден.`);
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
