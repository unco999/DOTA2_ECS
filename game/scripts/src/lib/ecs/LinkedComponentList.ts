import {ILinkedComponent} from './LinkedComponent';

export class LinkedComponentList<T extends ILinkedComponent> {
  private _head?: T;

  public get head(): T | undefined {
    return this._head;
  }

  public get isEmpty(): boolean {
    return this._head === undefined;
  }

  public add(linkedComponent: T): void {
    print(linkedComponent.constructor.name)
    DeepPrintTable(linkedComponent)
    let prev: T | undefined = undefined;
    let current: T | undefined = this._head;
    print("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent",current)
    while (current !== undefined) {
      if (current === linkedComponent) {
         print('Component is already appended, appending it once again will break linked items order');
      }
      print("prev?.id",prev?.id)
      prev = current;
      if(current.next != none){
        current = current.next as (T | undefined);
      }else{
        current = undefined;
      }
    }
    if (this._head === undefined) {
      this._head = linkedComponent;
      print("_head_head_head_head",this._head['uid'])
    } else {
      prev.next = linkedComponent;
      print("linkedComponent back",prev!['uid'])
      print("linkedComponent next",prev!.next ['uid'])

    }
  }

  public remove(linkedComponent: T): boolean {
    print("删除了 linkedComponent",linkedComponent.id)
    const [prev, current] = this.find(linkedComponent);
    if (current === undefined) {
      return false;
    }
    if (prev === undefined) {
      this._head = current.next as (T | undefined);
    } else {
      prev.next = current.next;
    }
    return true;
  }

  public* nodes() {
    let node = this.head;
    while (node !== undefined) {
      yield node;
      node = node.next as (T | undefined);
    }
  }

  public iterate(action: (value: T) => void): void {
    for (const node of this.nodes()) {
      action(node);
    }
  }

  public clear(): void {
    this._head = undefined;
  }

  private find(linkedComponent: T): [prev: T | undefined, current: T | undefined] {
    let prev: T | undefined;
    let current: T | undefined = this._head;

    while (current !== undefined) {
      if (current === linkedComponent) {
        return [prev, current];
      }
      prev = current;
      current = current.next as (T | undefined);
    }
    return [undefined, undefined];
  }
}
