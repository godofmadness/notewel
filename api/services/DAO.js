/**
 * Created by mm on 4/3/17.
 */


module.exports = {

  executeQuery: function(SQL, params) {
    var params = _.toArray(params);

    console.log("PARAMS: " );
    console.log(params);

    return new Promise(function(resolve, reject){
      Notewel.query(SQL, params, function(err, rawResult){
          if (err) {
            reject(err);
          }
          // console.log("RESOLVED")
          resolve(rawResult)
        });
    });

  }


}
