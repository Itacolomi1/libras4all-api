import { User } from './../models/user';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('config/appSettings.json');
var lodash = require('lodash');

export class UserDAO extends BaseDao<User>{

    authenticate(login_user: any, password: any)  {
        var deferred = this.Q.defer(); 
        
            
        this._collection.findOne({ email: login_user }, function (err: any, user: any) {
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
    }

    create(item: User): Promise<boolean> {
                
        var deferred = this.Q.defer(); 
        
        var user = lodash.omit(item, 'password');

        user.hash = bcrypt.hashSync(item.password, 10);
    
        this._collection.insertOne(
            user,
                function (err: any, doc: any) {
                    debugger
                    if (err) deferred.reject(err.name + ': ' + err.message);
    
                    deferred.resolve();
                });
       
    
        return deferred.promise;
    }

    getNivel(idUsuario:string): Promise<boolean> {

        var deferred = this.Q.defer(); 

        this._collection.findOne({ _id: new this._objectID.createFromHexString(idUsuario) }, function (err: any, nivel: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            if (nivel) {                                                      
                deferred.resolve(nivel.nivel);
            } else {
                // user not found
                deferred.resolve();
            }
        });
    
        return deferred.promise;

    }

}


