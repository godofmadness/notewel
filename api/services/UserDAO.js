/**
 * Created by mm on 4/8/17.
 */


module.exports = {


  follow: function(params) {
    var SQL = 'insert into relationship (followerId, followingId) values (?, ?);';

    console.log(params)
    return DAO.executeQuery(SQL, params);
  },


  findFollowers: function(params) {
    //param - my id
    var SQL = "select user.username from relationship inner join user on followerId = userId where followingId = ?";

    return DAO.executeQuery(SQL, params)

  },


  findFollowing: function(params) {

    var SQL = "select username from relationship " +
      "inner join user on relationship.followingId = user.userId  where followerId = ?;";

    return DAO.executeQuery(SQL, params)
  },


  checkMeFollowing: function(params) {
    // if me following
    var SQL = "select followingId from relationship " +
      "inner join user on followingId = userId where followerId = ? and username = ?";

    return DAO.executeQuery(SQL, params);
  }



}
