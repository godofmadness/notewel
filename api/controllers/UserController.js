/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var EmailAddressValidaor = require("machinepack-emailaddresses");
var BCryptEncrypter = require("machinepack-passwords");
var GravatarGenerator = require("machinepack-gravatar");
var nodeBCrypt = require("bcrypt-nodejs");

module.exports = {


  login: function(req, res) {


      if(req.session.userId) {
        return res.send(403, "You already logged in");
      }

      if (_.isUndefined(req.param('usernameOrEmail'))) {
        return res.send(400, 'An email address or username is required!');
      }

      if (_.isUndefined(req.param('password'))) {
        // Send 400 status code: Bad request
        return res.send(400, 'A password is required!');
      }

      User.findOne({
        or: [
          { username: req.param('usernameOrEmail') },
          { email: req.param('usernameOrEmail') }
        ]
      }).exec(function(err, findedUser){
        if (err) {
          return res.send(500, "Server Error Occured");
        }

        if (!findedUser) {
          return res.send(404, "Incorrect username or email. Try Again")
        }

        nodeBCrypt.compare(req.param('password'), findedUser.encryptedPassword, function(err, same){
          if (!same) {
            return res.send(400, "Incorrect Password. Try Again")
          }

          req.session.userId = findedUser.userId;

          return res.json({
            username: findedUser.username,
            email: findedUser.email
          });

        })
      });


  },

  signup: function (req, res) {
    // console.log('sign up');
    if (_.isUndefined(req.param('email'))) {  
        return res.badRequest('An email address is required!'); 
    }

    if (_.isUndefined(req.param('password'))) {
      // Send 400 status code: Bad request
      return res.badRequest('A password is required!');
    }

    if (req.param('password').length < 6) {
      return res.badRequest('Password must be at least 6 characters!');
    }

    if (_.isUndefined(req.param('username'))) {
      return res.badRequest('A username is required!');
    }

    if (req.param('username').length < 6) {
      return res.badRequest('Username must be at least 6 characters!');
    }

    if (!_.isString(req.param('username')) || req.param('username').match(/[^a-z0-9]/i)) {
      return res.badRequest('Invalid username: must consist of numbers and letters only.');
    }

    EmailAddressValidaor.validate({
      string: req.param('email')
    }).exec({
      error: function(err){
        res.serverError(err)
      },

      invalid: function() {
        res.badRequest("Email adress not correct");
      },

      success: function() {

        BCryptEncrypter.encryptPassword({
          password: req.param("password")
        }).exec({

          error: function(err){
            res.serverError(err)
          },

          success: function(encryptedPassword) {

            var options = {
              email: req.param('email'),
              username: req.param('username'),
              encryptedPassword: encryptedPassword,
              deleted: false,
              admin: false,
              banned: false
            };

            User.create(options).exec(function(err, createdInstance){
              if (err) {
                console.log(err);

                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
                  && err.invalidAttributes.email[0].rule === 'unique') {

                  return res.send(409, 'Email address is already taken by another user, please try again.');
                }

                if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0]
                  && err.invalidAttributes.username[0].rule === 'unique') {

                  return res.send(409, 'Username is already taken by another user, please try again.');
                }
              }
              User.findOne({username: createdInstance.username}).exec(function(err, findedUser){
                  req.session.userId = findedUser.userId;
                return res.json(createdInstance)
              });
            });

          }

        });
      }

    });
  },


  logout: function(req, res) {
    if (!req.session.userId) {

      if (req.wantsJSON) {
        return res.json({status: "NOT LOGGED IN"});
      }

      return res.send(404, "You not logged in")
    }

    User.findOne({userId: req.session.userId}).exec(function(err, findedUser){
      if (err) {
        return res.send(500, "Server Error");
      }

      if (!findedUser) {
        return res.send(404, "User not found")
      }

      req.session.userId = null;
      return res.send(200);
    })
  },


  isLoggedIn: function(req, res) {
    if (!req.session.userId) {
      return res.json(null);
    }

    User.findOne({userId: req.session.userId}).exec(function(err, user){
      if (err) {
        return res.negotiate(err);
      }

      return res.json({
        username: user.username,
        email: user.email
      });

    });
  },



  findOne: function(req, res) {
    User.findOne({username: req.param("username")}).exec(function(err, requestedUser) {
      if (_.isUndefined(requestedUser)) {
        return res.send(404, "User not found.");
      }

      if (err) {
        return res.negotiate(err);
      }

      var user = {
        isMe: req.session.userId === requestedUser.userId ? true : false,
        email: requestedUser.email,
        username: requestedUser.username,
        admin: requestedUser.admin,
        banned: requestedUser.banned,
        deleted: requestedUser.deleted,
        userId: requestedUser.userId
      }
      return res.json(user);
    })
  },


  removeProfile: function(req, res) {
    User.update({id: req.param("id")}, {deleted: "true"})
      .exec(function(err, updatedUsers){
        if (err) {
          return res.send(500, "Server Error.")
        }

        if (updatedUsers.length === 0) {
          return res.send(404, "No user found.")
        }

        return res.send(200);
      })

  },


  restoreProfile: function(req,res) {
    console.log(req.param("email"));
    console.log(req.param('password'));

    User.findOne({
      email: req.param('email')
    }).exec(function(err, finded){

      if (err) {
        return res.send(500, "Server Find user by email Error.")
      }

      if (_.isUndefined(finded)) {
        return res.send(404, "No user found.")
      }

      nodeBCrypt.compare(req.param("password"), finded.encryptedPassword, function(err, result) {
        if (err) {
          return res.send(500, "Server Crypting Error. ")
        }

        if (result) {
          User.update({id: finded.id},{deleted: "false"}).exec(function(err, updatedUsers) {
            if (err) {
              return res.send(500, "Server Updating Error. ")
            }

            if (updatedUsers.length === 0) {
              return res.send(404, "No user found.")
            }

            return res.send(200, updatedUsers);

          });
        } else {
          return res.send(404, "No user found.")
        }

      });
    });
  },


  restoreGravatarURL: function(req, res) {

    try {
      var restoredGravatarUrl = GravatarGenerator.getImageUrl({
        emailAddress: req.param("email")
      }).execSync();

    } catch(err) {
      res.negotiate(err);
    }
    console.log(restoredGravatarUrl);
    res.json(restoredGravatarUrl);
  },


  updateProfile: function(req, res) {
    User.update({id: req.param('id')}, {gravatarURL: req.param("gravatarURL")}).exec(function (err, updatedUsers) {
      if (err) {
        console.log(err);
        return res.send(500, "Error in updating user gravatar.");
      }

      if (updatedUsers.length === 0) {
        return res.send(400, "Updating user not found");
      }

      res.json(updatedUsers)

    })
  },



  changePassword: function(req, res) {
    console.log(req.param('currentPassword'));
    console.log(req.param('password'));
    console.log(req.param('id'));

    if (_.isUndefined(req.param('password'))) {
      return res.send(400, "password requred");
    }

    if (req.param('password').length < 6) {
      return res.send(400, "password must be at least 6 characters");
    }


    if (_.isUndefined(req.param('currentPassword'))) {
      return res.send(400, "current requred");
    }


    if (req.param('currentPassword').length < 6) {
      return res.send(400, "currentPassword must be at least 6 characters");
    }


    User.findOne({id: req.param('id')}).exec(function(err, user) {
      if (err) {
        return res.send(500, "Server error in finding currnet record.")
      }

      if (_.isUndefined(user)) {
        return res.send(404," User not found")
      }

      nodeBCrypt.compare(req.param('currentPassword'), user.encryptedPassword, function(err, finded) {
        if (err) {
          return res.send(500, "Server encrypting error.")
        }

        if (!finded) {
          return res.send(404, "Current password entered wrong.")
        }

        // update password
        nodeBCrypt.hash(req.param('password'), null, null, function(err, encryptedNewPassword) {
          if (err) {
            return res.send(500, "Server encrypting error");
          }

          User.update({id: user.id}, {encryptedPassword: encryptedNewPassword}).exec(function(err, updatedUsers){
             if (err) {
               return res.send(500, "Server update record password error");
             }

             if (updatedUsers.length === 0) {
               return res.send(404, "No users to update");
             }

             return res.json(updatedUsers);

          });
        })
      })
    });

  },


  adminUsers: function(req, res) {
    User.find().exec(function(err, listOfUsers){
      console.log(listOfUsers);
      if (err) {
        return res.send(500, "Server error loading users");
      }

      res.json(listOfUsers)

    });
  },


  updateAdmin: function(req, res) {
    User.update(req.param('id'), {               
        admin: req.param('admin')             
  }).exec(function(err, update){

      if (err) return res.negotiate(err);         
   
        res.ok();                                
    });
  },

  updateBanned: function(req, res) {
    User.update(req.param('id'), {
      banned: req.param('banned')
    }).exec(function(err, update){
      if (err) return res.negotiate(err);
      res.ok();
    });
  },

  updateDeleted: function(req, res) {
    User.update(req.param('id'), {
      deleted: req.param('deleted')
    }).exec(function(err, update){
      if (err) return res.negotiate(err);
      res.ok();
    });
  }


};


