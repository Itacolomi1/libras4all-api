import { BaseDao } from "../core/baseDAO.core";
import { Email } from '../models/email';

import * as nodemailer from "nodemailer";
import config from '../config/email';

declare global{
    var conn: any;
    var collection: any;
}

export class EmailDAO extends BaseDao<Email>{
    
    criarHistorico(historico: Email) {
        var deferred = this.Q.defer();        
        this._collection.insertOne(
            historico,
            function (err: any, obj: any) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (obj) {               
                    deferred.resolve(obj.ops[0]._id);
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;
    }

    enviar(to: string, subject: string, message: string) {
        let mailOptions = {
            from: config.user,
            to: to,
            subject: subject,
            html: message
        };

        const transporter = nodemailer.createTransport({
            service: config.service,
            auth:{   
                user:config.user,
                pass:config.password
            }
        });
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return error;
            } else {
                return "E-mail enviado com sucesso!";
            }
        });
    }
}