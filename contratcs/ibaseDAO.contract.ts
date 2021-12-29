export interface IBaseDAO<T> {

    create(item: T): Promise<boolean>;

    update(id:string,item: T): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    list(item: T): Promise<T[]>;

    listAll(): Promise<T[]>;

    getById(_id: string): Promise<T>;

}
