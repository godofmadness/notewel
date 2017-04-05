
/**
 * Created by mm on 4/3/17.
 */
module.exports = {


  like: function(params) {

    var SQL = "INSERT INTO likes (userId, notewelId) values (?,?);";

    return DAO.executeQuery(SQL, params);
  },



  unlike: function(params) {
    var SQL = "DELETE FROM likes WHERE userId=? and notewelId=?;";

    return DAO.executeQuery(SQL, params);

  },



  getMyLikedNotwelsOnParticularUser: function(params) {
     var SQL = "select user.userId, user.email, notewel.notewelId, notewel.userId, notewel.numberOfLikes " +
       "from user inner join likes on user.userId = likes.userId " +
       "inner join notewel on notewel.notewelId = likes.notewelId where user.userId=? and notewel.userId = ?;";

      return DAO.executeQuery(SQL, params)

  },


  deleteNotewel: function(params) {
    var SQL = "DELETE FROM NOTEWEL WHERE notewelId=?";

    return DAO.executeQuery(SQL, params)
  }



}
