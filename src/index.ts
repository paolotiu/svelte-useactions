/**
 * The return type of an action.
 */
export type ActionReturn<Params> = {
  destroy?: () => void;
  update?: (params: Params) => void;
} | void;

/**
 * Action type shim
 */
export type ActionLike<Node extends HTMLElement> = (node: Node, params: any) => any;

/**
 * A primitive Action
 */
export type Action<Node extends HTMLElement = HTMLElement, Params extends any = undefined> = (
  node: Node,
  params?: Params
) => ActionReturn<Params>;

/**
 * A list of actions
 */
export type ActionList<
  Node extends HTMLElement,
  Arr extends Array<ActionLike<Node>> = Array<ActionLike<Node>>
> = [
  ...{
    [I in keyof Arr]: Arr[I] extends ActionLike<Node>
      ? Parameters<Arr[I]>[1] extends undefined
        ? [Arr[I]]
        : [Arr[I], Parameters<Arr[I]>[1]]
      : never;
  }
];

/**
 * A wrapper function that provides intellisense
 */
export const createActionList = <Node extends HTMLElement, Arr extends Array<ActionLike<Node>>>(
  actions: ActionList<Node, Arr>
): ActionList<Node, Arr> => {
  return actions;
};

/**
 * Takes in actions as a parameter and executes them all.
 * Also manages the update and destroy functions if present.
 */
export const useActions = <Node extends HTMLElement, Arr extends Array<ActionLike<Node>>>(
  node: Node,
  actions: ActionList<Node, Arr>
) => {
  const actionReturns: ActionReturn<Record<string, any>>[] = [];

  if (actions) {
    actions.forEach((currentTuple) => {
      const action = currentTuple[0];
      const params = currentTuple[1];

      actionReturns.push(action(node, params));
    });
  }

  return {
    update(actions: ActionList<Node, Arr>) {
      actions.forEach((currentTuple, i) => {
        const currentReturn = actionReturns[i];
        const params = currentTuple[1];

        if (!currentReturn) return;

        if (typeof params !== 'undefined') {
          currentReturn.update?.(params);
        }
      });
    },
    destroy() {
      actionReturns.forEach((currentReturn) => {
        if (currentReturn) currentReturn.destroy?.();
      });
    },
  };
};
