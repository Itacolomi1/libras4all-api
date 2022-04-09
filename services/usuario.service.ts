import { Usuario } from '../models/usuario';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class UsuarioDAO extends BaseDao<Usuario>{

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


