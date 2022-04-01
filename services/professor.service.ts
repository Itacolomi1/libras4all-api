import { Professor } from './../models/professor';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class ProfessorDAO extends BaseDao<Professor>{

}


