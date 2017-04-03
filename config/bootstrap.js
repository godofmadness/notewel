/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  // return cb();

    Notewel.create({
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
      attachments: null,
      style: "yellow",
      owner: 'GodOfMadness',
      userId: 1,
      numberOfLikes: 12
    }).exec(function(err, createdNotewel){
        if (err) {
          return cb(err)
        }
      Notewel.create({
        message: "consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
        attachments: null,
        style: "green",
        owner: 'GodOfMadness',
        numberOfLikes: 13
      }).exec(function(err, createdNotewel){
        if (err) {
          return cb(err)
        }
        Notewel.create({
          message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque ",
          attachments: null,
          style: "yellow",
          owner: 'GodOfMadness',
          userId: 1,
          numberOfLikes: 1
        }).exec(function(err, createdNotewel){
          if (err) {
            return cb(err)
          }
          Notewel.create({
            message: " Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? ",
            attachments: null,
            style: "yellow",
            owner: 'GodOfMadness',
            numberOfLikes: 99
          }).exec(function(err, createdNotewel){
            if (err) {
              return cb(err)
            }
            Notewel.create({
              message: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
              attachments: null,
              style: "green",
              owner: 'GodOfMadness',
              numberOfLikes: 42
            }).exec(function(err, createdNotewel){
              if (err) {
                return cb(err)
              }

              User.create({
                username:"max",
                // userId:1
              }).exec(function(err, createdUser){
                if (err) {
                  return cb(err);
                }
                console.log(createdUser)

                User.find({userId:1}).populate("notewels").exec(function(err, data){
                  if (err) {
                    return cb(err);
                  }

                  console.log(data);
                  return cb();
                });

              });


              //return cb()
            });
          });
        });
      });
    });



  // // Return the number of records in the video model
  // Video.count().exec(function (err, numVideos) {
  //   if (err) {
  //     return cb(err);
  //   }
  //
  //   // If there's at least one log the number to the console.
  //   if (numVideos > 0) {
  //     console.log('Existing video records: ', numVideos)
  //     return createTestUsers();
  //   }
  //
  //   // Add machinepack-youtube as a depedency
  //   var Youtube = require('machinepack-youtube');
  //
  //   // List Youtube videos which match the specified search query.
  //   Youtube.searchVideos({
  //     query: 'grumpy cat',
  //     apiKey: sails.config.google.apiKey,
  //     limit: 15
  //   }).exec({
  //     // An unexpected error occurred.
  //     error: function (err) {
  //
  //     },
  //     // OK.
  //     success: function (foundVideos) {
  //       _.each(foundVideos, function (video) {
  //         video.src = 'https://www.youtube.com/embed/' + video.id;
  //         delete video.description;
  //         delete video.publishedAt;
  //         delete video.id;
  //         delete video.url;
  //       });
  //
  //       Video.create(foundVideos).exec(function (err, videoRecordsCreated) {
  //         if (err) {
  //           return cb(err);
  //         }
  //         console.log(foundVideos);
  //         return createTestUsers();
  //       });
  //     }
  //
  //   });
  // });
  //
  //
  // function createTestUsers() {
  //
  //   var Passwords = require('machinepack-passwords');
  //   var Gravatar = require('machinepack-gravatar');
  //
  //   User.findOne({
  //     email: 'maxdeligarmr@gmail.com'
  //   }).exec(function (err, foundUser) {
  //     if (foundUser) {
  //       return cb();
  //     }
  //
  //     Passwords.encryptPassword({
  //       password: '123123'
  //     }).exec({
  //       error: function (err) {
  //         return cb(err);
  //       },
  //       success: function (result) {
  //
  //         var options = {};
  //
  //         try {
  //           options.gravatarURL = Gravatar.getImageUrl({
  //             emailAddress: 'maxdeligarmr@gmail.com'
  //           }).execSync();
  //
  //         } catch (err) {
  //           return cb(err);
  //         }
  //
  //         options.email = 'maxdeligarmr@gmail.com';
  //         options.encryptedPassword = result;
  //         options.username = '123123';
  //         options.deleted = false;
  //         options.admin = false;
  //         options.banned = false;
  //
  //         User.create(options).exec(function (err, createdUser) {
  //           if (err) {
  //             return cb(err);
  //           }
  //           return cb();
  //         });
  //       }
  //     })
  //   })
  // }
}
