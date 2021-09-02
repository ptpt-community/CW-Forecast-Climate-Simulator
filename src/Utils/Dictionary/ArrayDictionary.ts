import {IDictionary} from "./IDictionary";

export class ArrayDictionary<T> implements IDictionary<T> {
    private _collection: any = [];

    add(at: string, object: T) {
        this._collection[at] = object;
    }

    remove(at: string) {
        delete this._collection[at];
    }

    setAndReplace(object: T[]) {
        this._collection = object;
    }

    getAll(): T[] {
        return this._collection;
    }

    getAt(key: string): T {
        return this._collection[key];
    }

}