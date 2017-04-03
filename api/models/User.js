/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // drop database table every restart (development only)
  migrate: "drop",
  autoPK: false,

  attributes: {

    userId: {
      type: 'integer',
      primaryKey: true,
      unique: true
    },

    notewels: {
      collection: 'notewel',
      via: 'userId'
    },

    email: {
      type: 'string',
      email: true,
      unique: true
    },

    username: {
      type: 'string',
      unique: true
    },

    encryptedPassword: {
      type: 'string'
    },


    deleted: {
      type: 'boolean'
    },

    admin: {
      type: 'boolean'
    },

    banned: {
      type: 'boolean'
    },


    // delete attributes from response to client
    toJSON: function() {                
      var modelAttributes = this.toObject();
        delete modelAttributes.password;
        delete modelAttributes.confirmation;
        delete modelAttributes.encryptedPassword;
        return modelAttributes;
    }
}
};

