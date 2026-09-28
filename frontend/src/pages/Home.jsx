import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Home.css';

import logo from '../assets/logo.png';

import explore1 from '../assets/explore-1.JPG';
import explore2 from '../assets/explore-2.JPG';
import explore3 from '../assets/explore-3.JPG';
import explore4 from '../assets/explore-4.JPG';


/* =========================
   SAFE IMAGE COMPONENT
========================= */

function SafeImage({ src, alt, className }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className={`${className} image-placeholder`}>
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}


/* =========================
   IMAGE PATHS
========================= */

const asset = (fileName) => `/src/assets/${fileName}`;


/* =========================
   CATEGORIES
========================= */

const categories = [
  {
    name: 'Academics',
    image: asset('academics.JPG'),
  },
  {
    name: 'Electronics',
    image: asset('electronics.JPG'),
  },
  {
    name: 'Res Living',
    image: asset('res-living.JPG'),
  },
  {
    name: 'Fashion',
    image: asset('fashion.JPG'),
  },
  {
    name: 'Sports',
    image: asset('sports.JPG'),
  },
  {
    name: 'Beauty',
    image: asset('beauty.JPG'),
  },
  {
    name: 'Music',
    image: asset('music.JPG'),
  },
  {
    name: 'More',
    image: asset('more.JPG'),
  },
];


/* =========================
   PRODUCTS
========================= */

const demoProducts = [
  {
    id: 1,
    seller: 'Jon Erikson',
    name: 'Hacking - Textbook',
    price: 'R150',
    image: asset('hacking-book.JPG'),
  },
  {
    id: 2,
    seller: 'Russel Hobbs',
    name: 'Kettle',
    price: 'R170',
    image: asset('kettle.JPG'),
  },
  {
    id: 3,
    seller: 'Apple',
    name: 'Charger',
    price: 'R250',
    image: asset('charger.JPG'),
  },
  {
    id: 4,
    seller: 'Sam Ndlovu',
    name: 'Backpack',
    price: 'R200',
    image: asset('backpack.JPG'),
  },
  {
    id: 5,
    seller: 'Thato M.',
    name: 'Nike Air Force 1',
    price: 'R550',
    image: asset('nike-air-force.JPG'),
  },
];


/* =========================
   HERO SLIDES
========================= */

const heroSlides = [
  {
    image: explore1,
    title: 'Explore',
    description: (
      <>
        Find great deals from students
        <br />
        around your campus.
      </>
    ),
  },
  {
    image: explore2,
    title: 'Find More. Spend Less.',
    description: (
      <>
        Discover affordable items
        <br />
        from fellow students.
      </>
    ),
  },
  {
    image: explore3,
    title: 'Got Something to Sell?',
    description: (
      <>
        Turn your unused items into
        <br />
        extra cash.
      </>
    ),
  },
  {
    image: explore4,
    title: 'Buy. Sell. Connect.',
    description: (
      <>
        Trade with students
        <br />
        around your campus.
      </>
    ),
  },
];


/* =========================
   HOME
========================= */

export default function Home() {
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState('Home');
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState(demoProducts);

  useEffect(() => {
    let active = true;
    fetch('/api/items')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Listings unavailable')))
      .then((items) => {
        if (!active || !items.length) return;
        setProducts(items.map((item) => ({
          id: item.id,
          seller: item.sellerName,
          sellerId: item.sellerId,
          name: item.title,
          price: `R${Number(item.price).toFixed(2)}`,
          category: item.category,
          location: item.location || 'Campus meetup',
          condition: item.condition || 'Good',
          image: item.imageUrl || asset('more.JPG'),
          verifiedStudent: item.verifiedStudent,
        })));
      })
      .catch(() => {})
      .finally(() => { active = false; });
    return () => { active = false; };
  }, []);


  /* =========================
     AUTO CAROUSEL
  ========================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) =>
        current === heroSlides.length - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);


  /* =========================
     CAROUSEL CONTROLS
  ========================= */

  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === heroSlides.length - 1
        ? 0
        : current + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((current) =>
      current === 0
        ? heroSlides.length - 1
        : current - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };


  /* =========================
     FAVORITES
  ========================= */

  const toggleFavorite = (index) => {
    setFavorites((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };


  /* =========================
     SEARCH
  ========================= */

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.seller}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const currentHero = heroSlides[currentSlide];


  return (
    <div className="home-page">

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="home-main">


        {/* TOP BAR */}

        <header className="topbar">

          <div className="search-container">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search for items, people or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate('/search');
                }
              }}
            />

          </div>


          <button
            className="sell-button"
            onClick={() => navigate('/create-listing')}
          >
            <span className="sell-plus">+</span>
            <span>Sell an Item</span>
          </button>


          {/* ACTIVITY */}

          <button
            className="icon-button activity-button"
            aria-label="Activity"
            onClick={() => navigate('/messages')}
          >
            <span>✦</span>
            <span className="notification-dot"></span>
          </button>


          {/* USER */}

          <button
            className="user-menu"
            onClick={() => navigate('/profile')}
          >

            <div className="small-avatar">
              {JSON.parse(localStorage.getItem('user') || '{}').firstName?.[0] || 'U'}
              {JSON.parse(localStorage.getItem('user') || '{}').lastName?.[0] || ''}
            </div>

            <span className="user-arrow">
              ↓
            </span>

          </button>

        </header>


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="quick-actions">

          <button
            onClick={() => navigate('/search')}
          >
            <span className="quick-icon">♡</span>
            <span>Favorites</span>
          </button>


          <button
            onClick={() => navigate('/order-history')}
          >
            <span className="quick-icon">◷</span>
            <span>History</span>
          </button>


          <button
            onClick={() => navigate('/search')}
          >
            <span className="quick-icon">+</span>
            <span>Following</span>
          </button>


          <button
            className="extra-button"
            onClick={() => navigate('/search')}
            aria-label="More options"
          >
            <span>☷</span>
          </button>

        </section>


        {/* =========================
            HERO CAROUSEL
        ========================= */}

        <section className="hero">

          <SafeImage
            src={currentHero.image}
            alt={currentHero.title}
            className="hero-image"
          />

          <div className="hero-overlay"></div>


          <div className="hero-content">

            <span className="hero-kicker">
              UNITRADE MARKETPLACE
            </span>

            <h1>
              {currentHero.title}
            </h1>

            <p>
              {currentHero.description}
            </p>

            <button
              className="explore-button"
              onClick={() => navigate('/search')}
            >
              Explore now
              <span>→</span>
            </button>

          </div>


          {/* PREVIOUS */}

          <button
            className="hero-arrow left"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            ←
          </button>


          {/* NEXT */}

          <button
            className="hero-arrow right"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>


          {/* DOTS */}

          <div className="hero-dots">

            {heroSlides.map((_, index) => (

              <button
                key={index}
                className={`dot ${
                  currentSlide === index
                    ? 'active-dot'
                    : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />

            ))}

          </div>

        </section>


        {/* =========================
            CATEGORIES
        ========================= */}

        <section className="section">

          <div className="section-heading">

            <div className="heading-title">
              <div>
                <span className="section-eyebrow">
                  BROWSE
                </span>

                <h2>
                  Categories
                </h2>
              </div>

              <span className="heading-arrow">
                →
              </span>
            </div>


            <button
              className="view-all"
              onClick={() => navigate('/search')}
            >
              View all categories
              <span>→</span>
            </button>

          </div>


          <div className="categories">

            {categories.map((category) => (

              <button
                className="category"
                key={category.name}
                onClick={() => navigate(`/search?category=${encodeURIComponent(category.name === 'Academics' ? 'Books' : category.name === 'Res Living' ? 'Furniture' : category.name)}`)}
              >

                <div className="category-image">

                  <SafeImage
                    src={category.image}
                    alt={category.name}
                    className="category-image-content"
                  />

                </div>

                <span>
                  {category.name}
                </span>

              </button>

            ))}

          </div>

        </section>


        {/* =========================
            LATEST FINDS
        ========================= */}

        <section className="section latest-section">

          <div className="section-heading">

            <div className="heading-title">
              <div>
                <span className="section-eyebrow">
                  FRESH ON CAMPUS
                </span>

                <h2>
                  Latest Finds
                </h2>
              </div>

              <span className="heading-arrow">
                →
              </span>
            </div>


            <button
              className="view-all"
              onClick={() => navigate('/search')}
            >
              View all
              <span>→</span>
            </button>

          </div>


          <div className="products">

            {filteredProducts.map((product, index) => (

              <article
                className="product-card"
                key={product.name}
                onClick={() => navigate(`/listing/${product.id}`)}
              >

                <div className="product-image">

                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    className="product-image-content"
                  />


                  <button
                    className={`favorite-button ${
                      favorites.includes(index)
                        ? 'liked'
                        : ''
                    }`}
                    onClick={(event) => { event.stopPropagation(); toggleFavorite(index); }}
                    aria-label={
                      favorites.includes(index)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    {favorites.includes(index) ? '♥' : '♡'}
                  </button>

                </div>


                <div className="product-details">

                  <span className="seller">
                    {product.seller}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <strong className="price">
                    {product.price}
                  </strong>

                </div>

              </article>

            ))}

          </div>

          {filteredProducts.length === 0 && (
            <div className="home-empty-finds">
              <strong>No finds match that search.</strong>
              <button onClick={() => setSearch('')}>Clear search</button>
            </div>
          )}

        </section>

        <section className="campus-value-section">
          <div className="campus-value-heading">
            <span className="section-eyebrow">MADE FOR STUDENTS</span>
            <h2>A marketplace that feels close to campus.</h2>
            <p>Buy from verified students, ask questions before you commit, and arrange a simple public meetup.</p>
          </div>
          <div className="campus-value-grid">
            <article className="campus-value-card"><span className="value-number">01</span><h3>Browse with confidence</h3><p>Every seller profile carries a student verification signal so you know who you are dealing with.</p></article>
            <article className="campus-value-card"><span className="value-number">02</span><h3>Ask before you buy</h3><p>Message a seller to confirm availability, condition and a collection time that works for both of you.</p></article>
            <article className="campus-value-card campus-value-card-accent"><span className="value-number">03</span><h3>Have something to sell?</h3><p>Turn useful items you no longer need into extra cash for your next campus day.</p><button onClick={() => navigate('/create-listing')}>Create a listing <span aria-hidden="true">&#8594;</span></button></article>
          </div>
        </section>

      </main>

    </div>
  );
}