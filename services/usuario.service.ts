import { Usuario } from '../models/usuario';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class UsuarioDAO extends BaseDao<Usuario>{

}


