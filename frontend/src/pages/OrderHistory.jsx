import { Link } from 'react-router-dom';
import { getOrders } from '../utils/shop';
import './OrderHistory.css';

export default function OrderHistory() {
  const orders = getOrders();
  return <div className="shop-page history-page"><div className="shop-heading"><div><span className="shop-eyebrow">YOUR PURCHASES</span><h1>Order history</h1><p>Every order you have placed on UniTrade.</p></div><Link className="text-link" to="/search">Shop marketplace <span aria-hidden="true">&#8594;</span></Link></div>{orders.length === 0 ? <div className="empty-shop"><span className="empty-shop-icon">&#8594;</span><h2>No orders yet</h2><p>Your completed purchases will appear here.</p><Link className="btn-primary" to="/search">Find an item</Link></div> : <section className="history-list">{orders.map((order) => <Link className="history-item" to={`/order-details/${order.id}`} key={order.id}><div><span className="history-date">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span><h2>{order.id}</h2><p>{order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {order.meetupLocation}</p></div><div className="history-total"><strong>R{Number(order.total).toFixed(2)}</strong><span>{order.status}</span></div><span className="history-arrow" aria-hidden="true">&#8594;</span></Link>)}</section>}</div>;
}
