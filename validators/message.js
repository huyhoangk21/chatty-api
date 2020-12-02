const Joi = require('joi');

const from = Joi.string().trim().required().messages({
  'string.empty': 'From cannot be empty',
});

const to = Joi.string().trim().required().messages({
  'string.empty': 'To cannot be empty',
});

const content = Joi.string().trim().required().messages({
  'string.empty': 'Content cannot be empty',
});

module.exports = {
  sendMessage: Joi.object().keys({ to, content }),
};
