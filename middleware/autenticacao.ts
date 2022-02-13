import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const secret = "Libras4AllSecret";
  if (!authHeader) {
    return res.status(401).send({ error: "Nenhum Token Fornecido" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ error: "Erro no Token" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Token Mal Formatado" });
  }

  jwt.verify(token, secret ?? "", (err) => {
    if (err) return res.status(401).send({ error: "Token Inválido" });

    return next();
  });
};