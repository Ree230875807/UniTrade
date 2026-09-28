import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('user')));
    } catch {
      setUser(null);
    }
  }, []);

  if (!user) return <div className="profile-page"><h1>Profile unavailable</h1><p>Sign in again to view your account details.</p></div>;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-heading"><div><span className="profile-eyebrow">YOUR ACCOUNT</span><h1>Profile</h1><p>Your UniTrade account information.</p></div><Link className="profile-history-link" to="/order-history">View order history <span aria-hidden="true">&#8594;</span></Link></div>
      <section className="profile-card">
        <div className="profile-identity"><div className="profile-large-avatar">{initials}</div><div><h2>{user.firstName} {user.lastName}</h2><p>UniTrade member</p></div></div>
        <div className="profile-fields">
          <div><span>First name</span><strong>{user.firstName || 'Not provided'}</strong></div>
          <div><span>Last name</span><strong>{user.lastName || 'Not provided'}</strong></div>
          <div><span>University email</span><strong>{user.universityEmail || 'Not provided'}</strong></div>
          <div><span>Personal email</span><strong>{user.email || 'Not provided'}</strong></div>
          <div><span>Account status</span><strong className="profile-status">{user.verified ? 'Verified' : 'Active'}</strong></div>
        </div>
        <div className="profile-actions">
          <button type="button" className="logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </section>
    </div>
  );
}
