import { User } from './../models/user';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}


export class ServiceExampleDAO extends BaseDao<User>{


}


/* function authenticate(login_user:any, password: any) {

    var Q = require('q');
    var deferred = Q.defer();
    var users = global.conn.collection("Users");
 
    
    users.findOne({ login: login_user }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
} */