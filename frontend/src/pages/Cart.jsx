import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, saveCart } from '../utils/shop';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart);
  useEffect(() => { const sync = () => setCart(getCart()); window.addEventListener('unitrade-cart-updated', sync); return () => window.removeEventListener('unitrade-cart-updated', sync); }, []);
  const total = cart.reduce((sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, '')) * Number(item.quantity || 1), 0);
  const updateQuantity = (id, amount) => { const next = cart.map((item) => String(item.id) === String(id) ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) } : item); saveCart(next); setCart(next); };

  return <div className="shop-page cart-page"><div className="shop-heading"><div><span className="shop-eyebrow">YOUR BAG</span><h1>Shopping cart</h1><p>{cart.length} {cart.length === 1 ? 'item' : 'items'} ready for checkout.</p></div><Link className="text-link" to="/search">Continue shopping <span aria-hidden="true">&#8594;</span></Link></div>
    {cart.length === 0 ? <div className="empty-shop"><span className="empty-shop-icon">+</span><h2>Your cart is empty</h2><p>Browse the marketplace and add something useful for campus life.</p><Link className="btn-primary" to="/search">Browse listings</Link></div> : <div className="shop-grid"><section className="cart-list">{cart.map((item) => <article className="cart-item" key={item.id}><div className="cart-item-image">{item.image ? <img src={item.image} alt="" /> : <span>+</span>}</div><div className="cart-item-info"><span>{item.category || 'Marketplace item'}</span><h2>{item.name}</h2><p>{item.seller || 'Student seller'}{item.location ? ` · ${item.location}` : ''}</p><div className="quantity-control"><button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">-</button><strong>{item.quantity || 1}</strong><button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button></div></div><div className="cart-item-side"><strong>R{(Number(String(item.price).replace(/[^0-9.]/g, '')) * Number(item.quantity || 1)).toFixed(2)}</strong><button className="remove-button" onClick={() => { removeFromCart(item.id); setCart(getCart()); }}>Remove</button></div></article>)}</section><aside className="summary-card"><h2>Order summary</h2><div><span>Subtotal</span><strong>R{total.toFixed(2)}</strong></div><div><span>Meet-up</span><span className="free-label">Free</span></div><hr /><div className="summary-total"><span>Total</span><strong>R{total.toFixed(2)}</strong></div><button className="btn-primary summary-button" onClick={() => navigate('/checkout')}>Go to checkout <span aria-hidden="true">&#8594;</span></button></aside></div>}
  </div>;
}
