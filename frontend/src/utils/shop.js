const CART_KEY = 'unitrade-cart';
const ORDERS_KEY = 'unitrade-orders';

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export const getCart = () => read(CART_KEY, []);

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('unitrade-cart-updated'));
};

export const addToCart = (item) => {
  const cart = getCart();
  const existing = cart.find((cartItem) => String(cartItem.id) === String(item.id));
  if (existing) return cart;
  const nextCart = [...cart, { ...item, quantity: 1 }];
  saveCart(nextCart);
  return nextCart;
};

export const removeFromCart = (id) => {
  const nextCart = getCart().filter((item) => String(item.id) !== String(id));
  saveCart(nextCart);
  return nextCart;
};

export const clearCart = () => saveCart([]);
export const getOrders = () => read(ORDERS_KEY, []);

export const createOrder = ({ items, customer, meetupLocation, paymentMethod }) => {
  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
  const order = {
    id: `UT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    items,
    customer,
    meetupLocation,
    paymentMethod,
    total,
  };
  const orders = [order, ...getOrders()];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  clearCart();
  return order;
};

export const getOrder = (id) => getOrders().find((order) => order.id === id);

export const notifyOrderSellers = async (order) => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) return 0;
    const users = await response.json();
    const sellers = order.items
      .map((item) => users.find((user) => String(user.id) === String(item.sellerId) || `${user.firstName} ${user.lastName}`.toLowerCase() === String(item.seller || '').toLowerCase()))
      .filter((user, index, list) => user && list.findIndex((candidate) => candidate.id === user.id) === index);

    const results = await Promise.all(sellers.map((seller) => fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: order.customer?.id,
        receiverId: seller.id,
        content: `Order ${order.id} received. A student ordered your item and would like to arrange a campus collection. Please confirm when you have seen this.`,
      }),
    })));
    return results.filter((result) => result.ok).length;
  } catch {
    return 0;
  }
};
