import { Professor } from './../models/professor';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class ProfessorDAO extends BaseDao<Professor>{

    obterPeloEmail(email: string) {
        var deferred = this.Q.defer();
        this._collection.findOne({ email: email }, function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (obj) {           
                deferred.resolve(obj);
            } else {
                deferred.resolve();
            }
        });  
        return deferred.promise;
    }
}


