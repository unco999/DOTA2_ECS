/**
 * Linked list interface for linked components
 * @see {@link Entity.append}
 */

export interface ILinkedComponent {
  id?: string;
  next?: ILinkedComponent;
}

/**
 * Simple ILinkedComponent implementation
 */
export class LinkedComponent implements ILinkedComponent {
  public next?: this = undefined;

  public constructor(public id?: string,public uid = DoUniqueString("Linked")) {
  }
}

/**
 * @internal
 */
export function isLinkedComponent(component: any): component is ILinkedComponent {
  return component !== undefined && getmetatable(component).hasOwnProperty('next');
}
