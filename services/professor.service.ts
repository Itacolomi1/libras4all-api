import { Professor } from './../models/professor';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('config/appSettings.json');
var lodash = require('lodash');

export class ProfessorDAO extends BaseDao<Professor>{
    
    authenticate(login_user: any, password: any)  {
        var deferred = this.Q.defer();            
        
        this._collection.findOne({ email: login_user, password: password }, function (err: any, user: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (user) {
                deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
            } else {
                deferred.resolve();
            }
        });    
        return deferred.promise;
    }

    create(item: Professor): Promise<boolean> {                
        var deferred = this.Q.defer();      
        var user = lodash.omit(item, 'password');
        user.password = bcrypt.hashSync(item.password, 10); 
        this._collection.insertOne(
            user,
                function (err: any, doc: any) {
                    debugger
                    if (err) deferred.reject(err.name + ': ' + err.message);  
                    deferred.resolve();
                });   
        return deferred.promise;
    }
}


