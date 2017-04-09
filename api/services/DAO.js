/**
 * Created by mm on 4/3/17.
 */


module.exports = {



  executeQuery: function(SQL, params) {

    // take array of params
    var params = _.toArray(params);

    return new Promise(function(resolve, reject){
      Notewel.query(SQL, params, function(err, rawResult){
          if (err) {
            reject(err);
          }

          resolve(rawResult)
        });
    });
  }

}
