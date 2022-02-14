import { SinalMestreMandou } from './../models/sinalMestreMandou';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class SinalMestreMandouDAO extends BaseDao<SinalMestreMandou>{

}


