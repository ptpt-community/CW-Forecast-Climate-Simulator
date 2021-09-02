export interface IDictionary<T> {
    add(at: string, object: T): void;

    remove(at: string): void;

    setAndReplace(object: T[]): void;

    getAll(): T[];

    getAt(key: string): T;
}