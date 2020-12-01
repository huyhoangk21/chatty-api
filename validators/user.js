const Joi = require('joi');

const username = Joi.string()
  .alphanum()
  .trim()
  .min(6)
  .max(30)
  .required()
  .messages({
    'string.empty': 'Username cannot be empty',
    'string.min': `Username must be at least {#limit} characters`,
    'string.max': `Username must not be more than {#limit} characters`,
    'string.alphanum': 'Username must not contain special characters',
  });

const email = Joi.string()
  .trim()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  })
  .lowercase()
  .required()
  .messages({
    'string.empty': 'Email must not be empty',
    'string.email': 'Email is not valid',
  });
const password = Joi.string().min(6).max(30).required().messages({
  'string.empty': 'Password must not be empty',
  'string.min': `Password must be at least {#limit} characters`,
  'string.max': `Password must not be more than {#limit} characters`,
});
const repeatPassword = Joi.ref('password');
const imageUrl = Joi.string().trim().allow('');

module.exports = {
  register: Joi.object().keys({
    username,
    email,
    password,
    repeatPassword,
  }),
  login: Joi.object().keys({
    username,
    password,
  }),
};
