
/**
 * Created by mm on 4/3/17.
 */
module.exports = {


  findFeed: function(params) {
    var SQL = 'select message, numberOfLikes,notewel.updatedAt, notewelId, username from relationship ' +
      'inner join notewel on followingId = userId inner join user on notewel.userId = user.userId where followerId = ?;';
    return DAO.executeQuery(SQL, params);
  },

  like: function(params) {

    var SQL = "INSERT INTO likes (userId, notewelId) values (?,?);";

    that = this;
    return DAO.executeQuery(SQL, params).then(function(){
      return that.__changeLikeCounter({notewelId: params.notewelId}, "increase");
    });
  },



  unlike: function(params) {
    var SQL = "DELETE FROM likes WHERE userId=? and notewelId=?;";
    that = this;

    return DAO.executeQuery(SQL, params).then(function(){
      return that.__changeLikeCounter({notewelId: params.notewelId}, "decrease");
    });

    // return DAO.executeQuery(SQL, params);

  },


  __changeLikeCounter: function(params, operation) {

    if (operation === "decrease") {
      var SQL = "update notewel set numberOfLikes = numberOfLikes - 1 where notewelId = ?";
    } else {
      var SQL = "update notewel set numberOfLikes = numberOfLikes + 1 where notewelId = ?";
    }

    return DAO.executeQuery(SQL, params);

  },

  findAllLikes: function (params) {
    var SQL = "select notewelId from likes where userId = ?;";

    return DAO.executeQuery(SQL, params);

  },


  getMyLikedNotwelsOnParticularUser: function(params) {
     var SQL = "select user.userId, user.email, notewel.notewelId, notewel.userId, notewel.numberOfLikes " +
       "from user inner join likes on user.userId = likes.userId " +
       "inner join notewel on notewel.notewelId = likes.notewelId where user.userId=? and notewel.userId = ?;";

      return DAO.executeQuery(SQL, params);

  },


  deleteNotewel: function(params) {
    var SQL = "DELETE FROM NOTEWEL WHERE notewelId=?";

    return DAO.executeQuery(SQL, params)
  }



}
