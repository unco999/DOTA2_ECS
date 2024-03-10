/**
 * Linked list interface for linked components
 * @see {@link Entity.append}
 */

export interface ILinkedComponent {
  id?: string;
  next?: ILinkedComponent | none;
}


/**
 * @internal
 */
export function isLinkedComponent(component: any): component is ILinkedComponent {
  return component !== undefined && container.link_container.has(component.constructor.name)
}
