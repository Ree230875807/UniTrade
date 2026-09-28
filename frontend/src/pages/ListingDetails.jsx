import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addToCart, getCart } from '../utils/shop';
import './ListingDetails.css';

const demoListings = [
  { id: 1, name: 'Computer Science Textbook', category: 'Books', price: 180, seller: 'Lerato M.', location: 'CPUT Bellville', condition: 'Good', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85', description: 'A well-kept computer science textbook with clear notes and no missing pages.', sellerId: null },
  { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 120, seller: 'Sizwe D.', location: 'CPUT District Six', condition: 'Like new', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=85', description: 'Reliable wireless mouse, lightly used and ready for a new study setup.', sellerId: null },
  { id: 3, name: 'Winter Jacket', category: 'Clothing', price: 260, seller: 'Ava P.', location: 'Woodbridge Island', condition: 'Very good', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85', description: 'Warm winter jacket in very good condition. Clean and comfortable for chilly campus mornings.', sellerId: null },
  { id: 4, name: 'Study Desk', category: 'Furniture', price: 500, seller: 'Mpho K.', location: 'Mowbray', condition: 'Used', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85', description: 'Compact study desk with enough room for a laptop, books and a lamp.', sellerId: null },
];

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fallback = demoListings.find((item) => String(item.id) === id);
  const [listing, setListing] = useState(fallback);
  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Listing unavailable')))
      .then((item) => setListing({ id: item.id, name: item.title, category: item.category, price: Number(item.price), seller: item.sellerName, sellerId: item.sellerId, location: item.location || 'Campus meetup', condition: item.condition || 'Good', image: item.imageUrl, description: item.description, verifiedStudent: item.verifiedStudent }))
      .catch(() => {});
  }, [id]);
  const [added, setAdded] = useState(() => listing ? getCart().some((item) => String(item.id) === String(listing.id)) : false);
  if (!listing) return <div className="listing-detail-page"><Link className="text-link" to="/search">&#8592; Back to marketplace</Link><div className="empty-shop"><h2>Listing not found</h2><Link className="btn-primary" to="/search">Browse listings</Link></div></div>;

  const handleAdd = () => { addToCart({ ...listing, price: String(listing.price), seller: listing.seller }); setAdded(true); };
  return <div className="listing-detail-page"><Link className="text-link" to="/search">&#8592; Back to marketplace</Link><div className="listing-detail-grid"><section className="listing-detail-card"><div className="listing-detail-image"><img src={listing.image} alt={listing.name} /><span>{listing.condition}</span></div><div className="listing-detail-copy"><span className="detail-category">{listing.category}</span><h1>{listing.name}</h1><div className="detail-price">R{listing.price.toFixed(2)}</div><p>{listing.description}</p><div className="detail-facts"><div><span>Condition</span><strong>{listing.condition}</strong></div><div><span>Collection</span><strong>{listing.location}</strong></div></div><div className="detail-actions"><button className="btn-primary" onClick={handleAdd}>{added ? 'Added to cart' : 'Add to cart'} <span aria-hidden="true">&#8594;</span></button>{added && <button className="detail-cart-link" onClick={() => navigate('/cart')}>View cart</button>}</div></div></section><aside className="seller-card"><span className="detail-category">SELLER</span><div className="seller-identity"><div className="seller-avatar">{listing.seller.split(' ').map((part) => part[0]).join('')}</div><div><h2>{listing.seller}</h2><span className="verified-student">&#10003; Verified student</span></div></div><p>Only students with a verified university account can list on UniTrade.</p><Link className="message-seller-button" to={`/messages?seller=${encodeURIComponent(listing.seller)}`}>Message seller <span aria-hidden="true">&#8594;</span></Link><div className="seller-safety"><strong>Buy safely</strong><span>Ask if the item is still available before arranging a public campus meetup.</span><br /><br /><Link to={`/report-listing?itemId=${listing.id}`} style={{color: '#dc3545', fontWeight: 'bold', textDecoration: 'underline'}}>Report this listing</Link></div></aside></div></div>;
}
