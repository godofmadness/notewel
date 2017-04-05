/**
 * Notewel.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  migrate: "drop",

  autoPK: false,

  attributes: {


    notewelId: {
      type: 'text',

      // primaryKey: true,
      // unique: true
    },

    userId: {
      type: 'integer',
      model: 'user'
    },

    message: {
      type: 'string'
    },

    attachments: {
      type: 'string'
    },

    liked: {
      type: "boolean"
    },

    style: {
      type: 'string'
    },

    private: {
      type: 'boolean'
    },
    numberOfLikes: {
      type: "integer"
    }

  }

}

