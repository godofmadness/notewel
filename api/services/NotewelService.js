/**
 * Created by mm on 4/9/17.
 */


module.exports = {

  merge: function(liked, collection) {

    return new Promise(function(resolve, reject) {

      _.forEach(liked, function(likedNotewel){
          console.log("in foreach");
          findedNotewel = _.find(collection, function(notewel){
            return notewel.notewelId === likedNotewel.notewelId;
          });
          if (findedNotewel) {
            findedNotewel.liked = true;
          }
      });

      console.log("before resolve");
      resolve();
    });

  },



  sortByTime: function(collection) {
      return new Promise(function(resolve, reject){
        var time =[]
        console.log(collection);
        _.forEach(collection, function(item){
          item.updatedAt = Date.parse( item.updatedAt);
        });

        collection.sort(function(element1, element2){
          return element2.updatedAt - element1.updatedAt;
        });

        collection.filter(function(item) {
          // if note was made not less then two hours ago
          return item.updatedAt > (Date.parse(Date.now()) - 7200000)
        })

        _.forEach(collection, function(item){

          time.push(new Date(item.updatedAt).getHours())
          time.push(new Date(item.updatedAt).getMinutes())

          item.updatedAt = time.join(":");
          time = []
        });
        console.log(collection)

        resolve(collection);
      });
  }


}
