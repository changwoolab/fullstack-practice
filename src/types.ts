import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

// context의 타입들 저장
export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request;
    res: Response;
}