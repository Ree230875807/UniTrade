
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addToCart, getCart } from '../utils/shop';
import './Search.css';

const categories = ['All', 'Books', 'Electronics', 'Clothing', 'Furniture', 'Stationery', 'Music', 'Sports', 'Other'];

const demoProducts = [
  {
    id: 1,
    name: 'Computer Science Textbook',
    category: 'Books',
    price: 'R180',
    seller: 'Lerato M.',
    location: 'CPUT Bellville',
    condition: 'Good',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 'R120',
    seller: 'Sizwe D.',
    location: 'CPUT District Six',
    condition: 'Like new',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Winter Jacket',
    category: 'Clothing',
    price: 'R260',
    seller: 'Ava P.',
    location: 'Woodbridge Island',
    condition: 'Very good',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Study Desk',
    category: 'Furniture',
    price: 'R500',
    seller: 'Mpho K.',
    location: 'Mowbray',
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
];

export default function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState(demoProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/items')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Listings unavailable')))
      .then((items) => {
        if (!active) return;
        if (items.length) {
          setProducts(items.map((item) => ({
            id: item.id,
            name: item.title,
            category: item.category,
            price: `R${Number(item.price).toFixed(2)}`,
            seller: item.sellerName,
            sellerId: item.sellerId,
            location: item.location || 'Campus meetup',
            condition: item.condition || 'Good',
            image: item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
            verifiedStudent: item.verifiedStudent,
          })));
        }
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="search-page">
      <main className="search-main">
        <div className="search-topbar">
          <div className="search-main-input">
            <span className="search-main-icon">⌕</span>
            <input
              type="text"
              placeholder="Search for textbooks, electronics, clothes..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <button className="search-sell-button" onClick={() => navigate('/create-listing')}>
            <span>+</span>
            Sell
          </button>

          <button className="search-notification" onClick={() => navigate('/messages')} aria-label="Messages">
            ✉
          </button>

          <button className="search-user-button" onClick={() => navigate('/profile')}>
            <div className="search-small-avatar">{JSON.parse(localStorage.getItem('user') || '{}').firstName?.[0] || 'U'}</div>
            <span>⌄</span>
          </button>
        </div>

        <div className="search-heading">
          <span className="search-eyebrow">DISCOVER ON UNITRADE</span>
          <h1>Find what fits your student life.</h1>
          <p>{loading ? 'Loading student listings...' : 'Browse products listed by verified students around you.'}</p>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${activeCategory === category ? 'active' : ''}`}
              onClick={() => { setActiveCategory(category); if (category === 'All') setSearchParams({}); else setSearchParams({ category }); }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="search-toolbar">
          <div className="filter-group">
            <button className="filter-button">
              <span className="filter-icon">☷</span>
              Filters
            </button>

            <button className="filter-button">
              Price
              <span>⌄</span>
            </button>

            <button className="filter-button">
              Condition
              <span>⌄</span>
            </button>
          </div>

          <select className="sort-select">
            <option>Sort: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> listings
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="search-products">
            {filteredProducts.map((product) => (
              <article className="search-product-card" key={product.id} onClick={() => navigate(`/listing/${product.id}`)}>
                <div className="search-product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="condition-badge">{product.condition}</span>

                  <button
                    className={`search-favorite ${favorites.includes(product.id) ? 'liked' : ''}`}
                    onClick={(event) => { event.stopPropagation(); toggleFavorite(product.id); }}
                    aria-label={favorites.includes(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.includes(product.id) ? '♥' : '♡'}
                  </button>
                </div>

                <div className="search-product-details">
                  <span className="search-seller">{product.seller}{product.verifiedStudent !== false && <small> &#10003; Verified student</small>}</span>
                  <h3>{product.name}</h3>

                  <div className="search-product-bottom">
                    <span className="search-price">{product.price}</span>
                    <span className="search-location">{product.location}</span>
                  </div>
                  <button className="search-add-cart" onClick={(event) => { event.stopPropagation(); addToCart(product); }}>{getCart().some((item) => item.id === product.id) ? 'In cart' : 'Add to cart'}</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="search-empty">
            <div className="search-empty-icon">⌕</div>
            <h3>No listings found</h3>
            <p>Try searching for something else or choose another category.</p>
          </div>
        )}
      </main>
    </div>
  );
}

