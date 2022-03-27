export interface IBaseDAO<T> {

    criar(item: T): Promise<boolean>;

    atualizar(id:string,item: T): Promise<boolean>;

    excluir(id: string): Promise<boolean>;

    listar(): Promise<T[]>;

    obterPeloId(_id: string): Promise<T>;
}
