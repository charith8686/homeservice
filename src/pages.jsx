import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const USERS_KEY = 'hs_users';
const BOOKINGS_KEY = 'hs_bookings';
const CURRENT_KEY = 'hs_current';

const services = [
  { name: 'Plumbing', description: 'Tap and pipe repairs', price: 499, emoji: '🔧' },
  { name: 'Electrical', description: 'Lights and switch repairs', price: 599, emoji: '⚡' },
  { name: 'Cleaning', description: 'Deep home cleaning', price: 799, emoji: '✨' },
  { name: 'AC & Appliance', description: 'AC servicing and appliance repair', price: 699, emoji: '❄️' },
  { name: 'Painting', description: 'Interior wall painting and touch-ups', price: 1499, emoji: '🎨' },
  { name: 'Carpentry', description: 'Furniture assembly and door repairs', price: 549, emoji: '🪚' },
  { name: 'Pest Control', description: 'Safe home pest treatment', price: 899, emoji: '🛡️' },
  { name: 'Gardening', description: 'Lawn and balcony garden care', price: 449, emoji: '🌿' }
];

const defaultAdmins = [
  { name: 'Super Admin', email: 'admin@homeservices.com', password: 'admin123', role: 'admin', domain: 'All' },
  { name: 'Plumbing Admin', email: 'plumbing@homeservices.com', password: 'admin123', role: 'admin', domain: 'Plumbing' },
  { name: 'Electrical Admin', email: 'electrical@homeservices.com', password: 'admin123', role: 'admin', domain: 'Electrical' },
  { name: 'Cleaning Admin', email: 'cleaning@homeservices.com', password: 'admin123', role: 'admin', domain: 'Cleaning' }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getUsers() {
  const users = readStorage(USERS_KEY, null);
  if (users === null) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultAdmins));
    return defaultAdmins;
  }
  return users;
}

function getBookings() {
  const bookings = readStorage(BOOKINGS_KEY, null);
  if (bookings === null) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
    return [];
  }
  return bookings;
}

function Header({ menu }) {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-dot"></span>
        HomeServices
      </Link>
      <nav className="menu">{menu}</nav>
    </header>
  );
}

function logout(navigate) {
  localStorage.removeItem(CURRENT_KEY);
  navigate('/');
}

function ServiceCards({ bookable = false, onBook }) {
  return (
    <div className="services">
      {services.map(service => (
        <div className="card" key={service.name}>
          <div>
            <div className="icon-tile">{service.emoji}</div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
          <div className="card-bottom">
            <b>From ₹{service.price}</b>
            {bookable && (
              <button className="btn-sm" onClick={() => onBook(service.name)}>
                Book
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==================== CLEAN HOME PAGE ==================== */
export function Home() {
  return (
    <>
      <Header
        menu={
          <>
            <Link to="/">Overview</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        }
      />

      <main className="home-stage">
        <div className="home-shell">
          <span className="eyebrow">Home Maintenance Workspace</span>
          <h1>
            Home services, <span>made effortless.</span>
          </h1>
          <p>
            Schedule trusted specialists for plumbing, electrical, cleaning, and home repairs in one clean workspace.
          </p>

          <div className="home-cta">
            <Link className="button" to="/login">Login</Link>
            <Link className="button btn-light" to="/signup">Create Account</Link>
          </div>

          <div className="bento-strip">
            <div className="bento-mini">
              <strong>8</strong>
              <span>Service Domains</span>
            </div>
            <div className="bento-mini">
              <strong>Instant</strong>
              <span>Booking Requests</span>
            </div>
            <div className="bento-mini">
              <strong>Role-Based</strong>
              <span>Domain Admins</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">HomeServices | SDC Project #59</footer>
    </>
  );
}

/* ==================== SIGNUP ==================== */
export function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [domain, setDomain] = useState(services[0].name);
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    const name = event.target.name.value.trim();
    const email = event.target.email.value.trim().toLowerCase();
    const password = event.target.password.value;
    const confirm = event.target.confirm.value;
    const users = getUsers();

    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    if (users.some(user => user.email === email)) {
      setMessage('Email already registered');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role,
      ...(role === 'admin' ? { domain } : {})
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert('Signup successful. Please login.');
    navigate('/login');
  }

  return (
    <>
      <Header menu={<><Link to="/">Overview</Link><Link to="/login">Login</Link></>} />
      <div className="form-area">
        <form className="form-box" onSubmit={submit}>
          <h1>Create account</h1>
          <p className="form-sub">Select your role to continue</p>

          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'user' ? 'active' : ''}`}
              onClick={() => setRole('user')}
            >
              Customer
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <label>Full Name</label>
          <input name="name" required />

          <label>Email</label>
          <input name="email" type="email" required />

          {role === 'admin' && (
            <>
              <label>Service Domain</label>
              <select value={domain} onChange={e => setDomain(e.target.value)}>
                {services.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </>
          )}

          <label>Password</label>
          <input name="password" type="password" minLength="4" required />

          <label>Confirm Password</label>
          <input name="confirm" type="password" minLength="4" required />

          <button className="button">Signup</button>
          {message && <p className="msg-error">{message}</p>}
          <p className="form-link">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </>
  );
}

/* ==================== LOGIN ==================== */
export function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    const email = event.target.email.value.trim().toLowerCase();
    const password = event.target.password.value;
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) {
      setMessage('Invalid email or password');
      return;
    }
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    navigate(user.role === 'admin' ? '/admin' : '/user');
  }

  return (
    <>
      <Header menu={<><Link to="/">Overview</Link><Link to="/signup">Signup</Link></>} />
      <div className="form-area">
        <form className="form-box" onSubmit={submit}>
          <h1>Welcome back</h1>
          <p className="form-sub">Sign in to your workspace</p>

          <label>Email</label>
          <input name="email" type="email" required />

          <label>Password</label>
          <input name="password" type="password" required />

          <button className="button">Login</button>
          {message && <p className="msg-error">{message}</p>}
          <p className="form-link">Don't have an account? <Link to="/signup">Signup</Link></p>
        </form>
      </div>
    </>
  );
}

/* ==================== USER MODULE ==================== */
export function UserModule() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = readStorage(CURRENT_KEY, null);
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'user') { navigate('/admin'); return; }
    setCurrent(user);
    setBookings(getBookings().filter(b => b.email === user.email));
  }, [navigate]);

  function book(service) {
    const user = readStorage(CURRENT_KEY, null);
    if (!user) { navigate('/login'); return; }
    const all = getBookings();
    const booking = { id: Date.now(), name: user.name, email: user.email, service, status: 'Pending' };
    all.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    alert(service + ' booking request submitted!');
    setBookings(all.filter(b => b.email === user.email));
  }

  if (!current) return null;

  return (
    <>
      <Header
        menu={
          <>
            <span className="domain-tag">{current.name}</span>
            <button className="btn-light btn-sm" onClick={() => logout(navigate)}>Logout</button>
          </>
        }
      />
      <div className="workspace">
        <div className="page-header">
          <h2>Available Services</h2>
        </div>
        <ServiceCards bookable onBook={book} />

        <div className="page-header" style={{ marginTop: '44px' }}>
          <h2>My Bookings ({bookings.length})</h2>
        </div>
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--ink-secondary)', fontSize: '14px' }}>No bookings yet.</p>
        ) : (
          <div className="panel-list">
            {bookings.map(b => (
              <div className="booking" key={b.id}>
                <div>
                  <b>{b.service}</b>
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  <p>Booking ID: {b.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ==================== ADMIN MODULE ==================== */
export function AdminModule() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = readStorage(CURRENT_KEY, null);
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/user'); return; }
    setCurrent(user);
    refresh();
  }, [navigate]);

  function refresh() {
    setUsers(getUsers());
    setBookings(getBookings());
  }

  function updateStatus(id, status) {
    const all = getBookings();
    const booking = all.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
      refresh();
    }
  }

  if (!current) return null;

  const isSuperAdmin = !current.domain || current.domain === 'All';
  const visibleBookings = isSuperAdmin
    ? bookings
    : bookings.filter(b => b.service === current.domain);

  const customerUsers = users.filter(u => u.role === 'user');
  const domainAdmins = users.filter(u => u.role === 'admin');

  return (
    <>
      <Header
        menu={
          <>
            <span className="domain-tag">{isSuperAdmin ? 'All Domains' : current.domain}</span>
            <span>{current.name}</span>
            <button className="btn-light btn-sm" onClick={() => logout(navigate)}>Logout</button>
          </>
        }
      />

      <div className="workspace">
        <div className="page-header">
          <h2>Overview</h2>
        </div>

        <div className="stats">
          <div className="stat">
            <span>{isSuperAdmin ? 'Total Bookings' : `${current.domain} Bookings`}</span>
            <h2>{visibleBookings.length}</h2>
          </div>
          <div className="stat">
            <span>Pending</span>
            <h2>{visibleBookings.filter(b => b.status === 'Pending').length}</h2>
          </div>
          <div className="stat">
            <span>Completed</span>
            <h2>{visibleBookings.filter(b => b.status === 'Completed').length}</h2>
          </div>
          {isSuperAdmin && (
            <div className="stat">
              <span>Registered Users</span>
              <h2>{customerUsers.length}</h2>
            </div>
          )}
        </div>

        <div className="page-header">
          <h2>Manage Bookings</h2>
        </div>
        {visibleBookings.length === 0 ? (
          <p style={{ color: 'var(--ink-secondary)', fontSize: '14px', marginBottom: '28px' }}>No bookings yet.</p>
        ) : (
          <div className="panel-list">
            {visibleBookings.map(b => (
              <div className="booking" key={b.id}>
                <div>
                  <b>{b.service}</b>
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  <p>Customer: {b.name} ({b.email}) • ID: {b.id}</p>
                </div>
                <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {isSuperAdmin && (
          <>
            <div className="page-header">
              <h2>Domain Admins</h2>
            </div>
            <div className="panel-list">
              {domainAdmins.map(a => (
                <div className="booking" key={a.email}>
                  <div>
                    <b>{a.name}</b>
                    <p>{a.email}</p>
                  </div>
                  <span className="domain-tag">{a.domain || 'All'}</span>
                </div>
              ))}
            </div>

            <div className="page-header">
              <h2>Registered Users</h2>
            </div>
            {customerUsers.length ? (
              <div className="panel-list">
                {customerUsers.map(u => (
                  <div className="booking" key={u.email}>
                    <div>
                      <b>{u.name}</b>
                      <p>{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--ink-secondary)', fontSize: '14px' }}>No registered users yet.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}