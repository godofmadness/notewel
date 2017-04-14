/**
 * NotewelController
 *
 * @description :: Server-side logic for managing notewels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const uuid = require('uuid/v4');

module.exports = {


  findAll: function(req, res) {
    User.findOne({username: req.param('username')}).exec(function(err, findedUser){
      if (err) {
        return res.send(500, "Server Error");
      }

      if (!findedUser) {
        return res.send(404, "No such user");
      }

      Notewel.find({userId: findedUser.userId}).exec(function(err, notewels){
        if (err) {
          console.log(err);
        }


        // WHEN loading  user notewels check if this notes contain notes liked by me
      NotewelDAO.getMyLikedNotwelsOnParticularUser({
        myId: req.session.userId,
        userId: findedUser.userId
      })
        .then(function(data){
          console.log(data);
          if (data) {
            _.forEach(data, function (likedNotewel) {

              _.find(notewels, function(o) {
                  return o.notewelId === likedNotewel.notewelId;
              }).liked = true;

            });

          }
          return res.json(notewels);
        })
        .catch(function(err) {
          console.log(err);
          return res.send(500, "server error");
        });

      });


    });
  },



  findFeed: function(req, res){
    if (req.isSocket) {
      console.log('SOCKET REQUERST');
    }

    console.log('finding feed 4 ya');
    if (!req.session.userId) {
      return res.send(403, "You need to be logged in to perform that action");
    }

    NotewelDAO.findFeed({
      myId: req.session.userId
    }).then(function(data){

        console.log(data);
        // find all likes by current session

        NotewelDAO.findAllLikes({
          myId: req.session.userId
        }).then(function(findedLikedNotewels){
          console.log(findedLikedNotewels);

          if (!findedLikedNotewels) {
            return res.json(data);
          }

          // find liked notes in all feed and set liked to true
          NotewelService.merge(findedLikedNotewels, data).then(function(){
            // console.log('in promise');
            NotewelService.sortByTime(data).then(function(){
              console.log(data);
              return res.json(data);
            });
          });
        }).catch(function(err){ return res.send(500, "Server error"); });
      }).catch(function(err){
          return res.send(500, "Server error");
    });

  },



  find: function(req, res) {
    Notewel.findOne({notewelId: req.param('notewelId')}).exec(function(err, findedNotewel){
      if (err) {
        return res.send(500, "Server Error");
      }

      if (!findedNotewel) {
        return res.send(404, "No such user");
      }


      return res.json(findedNotewel)

    });
  },


  create: function(req, res) {
    if (!req.session.userId) {
      return res.send(403, "You need to be logged in to perform this action");
    }

    if (!req.param('userId') === req.session.userId) {
      return res.send(403, "You dont have permission to post notewels to another user account");
    }

    var uuidg = uuid();
    // console.log(uuidg)
    Notewel.create({
      notewelId: uuidg,
      userId: req.param('userId'),
      message: req.param('message'),
      attachments: null,
      liked: false,
      style: req.param('style'),
      private: req.param('private'),
      numberOfLikes: 0
    }).exec(function(err, createdNotewel){
      // console.log(createdNotewel);
      if (err) {
        return res.send(500, "Server error");
      }

      return res.json(createdNotewel);
    });


      // console.log(req.param('message'));


  },


  delete: function(req, res) {
    console.log("HERE");
    if (!req.session.userId) {
      return res.send(403, "You dont have privelleges to delete");
    }

    Notewel.findOne({notewelId: req.param('notewelId')}).exec(function(err, findedNotewel){
      if (err) {
        return res.send(500, "server error");
      }

      if (!findedNotewel) {
        return res.send(404, "Notewel not found");
      }

      if (!req.session.userId === findedNotewel.userId) {
        return res.send(403, "You dont have privelleges to delete");
      }



      NotewelDAO.unlike({
        userId: req.session.userId,
        notewelId: req.param('notewelId')
      })
        .then(function () {

          NotewelDAO.deleteNotewel({
            notewelId: req.param('notewelId')
          })
            .then(function(){
              res.send(200);
            })
            .catch(function(err) {
              console.log(err);
              return res.send(500, "Server error");
            });

        })
        .catch(function(err){
          console.log(err);
          return res.send(500, err);
        })



    });
  },


  like: function(req, res) {
    if(!req.session.userId) {
      return res.send(403, "You need to be logged in");
    }
    console.log("LIKED NOTE ID: " + req.param('notewelId'));

    NotewelDAO.like({
      userId: req.session.userId,
      notewelId: req.param('notewelId')
    })
      .then(function (data) {
          Notewel.findOne({notewelId: req.param('notewelId')}).exec(function(err, findedNotewel){

            if (err) {
              return res.send(500, "server error");
            }

            if (!findedNotewel) {
              return res.send(404);
            }

            return res.json({numberOfLikes: findedNotewel.numberOfLikes});
          });
    })
      .catch(function (err) {
      console.log(err);
      return res.send(500, "server error");
    });

  },


  removeLike: function(req, res) {
    if (!req.session.userId) {
      return res.send(403, "You need to be logged in");
    }

    Notewel.findOne({notewelId: req.param('notewelId')}).exec(function(err, findedNotewel){
      if (err) {
        return res.send(500, "server error");
      }

      if (findedNotewel.numberOfLikes === 0) {
        return res.send(200);
      }

      NotewelDAO.unlike({
        userId: req.session.userId,
        notewelId: req.param('notewelId')
      })
        .then(function(data) {

          return res.json({numberOfLikes: findedNotewel.numberOfLikes - 1});
        })
        .catch(function(err) {
          console.log(err);
          return res.send(500, "server error");
        });

    });



  }



};

