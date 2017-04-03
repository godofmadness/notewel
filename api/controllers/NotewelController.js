/**
 * NotewelController
 *
 * @description :: Server-side logic for managing notewels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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

      NotewelDAO.getMyLikedNotwelsOnParticularUser({
        myId: req.session.userId,
        userId: findedUser.userId
      })
        .then(function(data){
          console.log(data);
          if (data) {
            _.forEach(data, function (likedNotewel) {
              _.forEach(notewels, function (notewel) {
                likedNotewel.notewelId === notewel.notewelId ? notewel.liked = true : notewel.liked = false;
              });
            });
          }

          return res.json(notewels);
        })
        .catch(function(err) {
          console.log(err);
        });

      });


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

    // console.log(req.param('message'));
    Notewel.create({
      userId: req.param('userId'),
      message: req.param('message'),
      attachments: null,
      liked: false,
      style: req.param('style'),
      private: req.param('private'),
      numberOfLikes: 0
    }).exec(function(err, createdNotewel){
      if (err) {
        return res.send(500, "Server error");
      }

      res.json(createdNotewel);

    });
  },


  delete: function(req, res) {
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


      Notewel.destroy({notewelId: req.param("notewelId")}).exec(function(err, destroyedRecords){
        if (err) {
          return res.send(500, "Server error");
        }

        if (!destroyedRecords) {
          return res.send(404, "No such user");
        }

        return res.json(destroyedRecords[0]);

      });

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
      console.log(data);
    })
      .catch(function (err) {
      console.log(err);
    });

  },


  removeLike: function(req, res) {
    if (!req.session.userId) {
      return res.send(403, "You need to be logged in");
    }

    NotewelDAO.unlike({
      userId: req.session.userId,
      notewelId: req.param('notewelId')
    })
      .then(function(data) {
    })
      .catch(function(err) {
        console.log(err);
      });


    // NotewelDAO.getMyLikedNotwelsOnParticularUser({
    //   myId: req.session.userId,
    //   userId: 2
    // })
    //   .then(function(data){
    //     console.log("BIG DATA")
    //     console.log(data);
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });


  }



};

