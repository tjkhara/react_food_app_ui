import CartContext from "./cart-context";
import { useReducer } from "react";

// default cart state
const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    // Update the total amount
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // Search for the item
    const existingCartItemIndex = state.items.findIndex((item) => {
      return item.id === action.item.id;
    });

    // Pull out the existing item
    const existingCartItem = state.items[existingCartItemIndex];

    // This can have two values based on the if else below
    let updatedItems;

    // If the item exists
    if (existingCartItem) {
      // found an item
      // Make a copy of the items array in state
      // update the amount field
      let updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };

      console.log(updatedItem);

      // Update this in the array
      updatedItems = [...state.items]; // make a copy
      updatedItems[existingCartItemIndex] = updatedItem; // update the item with the modified item
    } else {
      // Item does not exist - just make a copy and add on the new item
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  } // ADD ends

  //  REMOVE action
  if (action.type === "REMOVE") {
    // find the item
    // Search for the item
    const existingCartItemIndex = state.items.findIndex((item) => {
      return item.id === action.id;
    });

    // get the item
    const existingCartItem = state.items[existingCartItemIndex];

    // Update the total amount
    const updatedTotalAmount = state.totalAmount - existingCartItem.price;

    let updatedItems;

    if (existingCartItem.amount === 1) {
      // Remove the item from the cart
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      // More than 1
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount - 1,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
