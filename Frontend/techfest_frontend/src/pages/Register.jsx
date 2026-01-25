import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

// Temporary static data. In the real app, replace these
// with values loaded from your backend / database.
const ROLES = [
  { id: 1, label: 'Attendee' },
  { id: 2, label: 'Organiser' },
];

const STATES = [
  // IDs match your `state` table: 1 = Maharashtra, 2 = Karnataka
  { id: 1, name: 'Maharashtra' },
  { id: 2, name: 'Karnataka' },
];

const CITIES_BY_STATE = {
  // Maharashtra (state_id = 1)
  1: [
    { id: 1, name: 'Mumbai' },
    { id: 2, name: 'Pune' },
    { id: 3, name: 'Nashik' },
    { id: 4, name: 'Nagpur' },
    { id: 5, name: 'Aurangabad' },
    { id: 6, name: 'Kolhapur' },
  ],
  // Karnataka (state_id = 2)
  2: [
    { id: 7, name: 'Bangalore' },
    { id: 8, name: 'Mangalore' },
    { id: 9, name: 'Mysore' },
    { id: 10, name: 'Hubli' },
    { id: 11, name: 'Belgaum' },
  ],
};

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    rid: '',       // role id
    stateId: '',
    cityId: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If state changes, reset city selection
      if (name === 'stateId') {
        return {
          ...prev,
          stateId: value,
          cityId: '',
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    // Clear error when user starts typing / selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.rid) {
      newErrors.rid = 'Please select a role';
    }

    if (!formData.stateId) {
      newErrors.stateId = 'Please select a state';
    }

    if (!formData.cityId) {
      newErrors.cityId = 'Please select a city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with actual API call to Auth_Service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just log (will be replaced with actual auth logic)
      console.log('Registration data:', formData);
      // navigate('/login'); // Uncomment when ready
      
      alert('Registration successful! (This is a placeholder - connect to backend)');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const availableCities = formData.stateId
    ? CITIES_BY_STATE[formData.stateId] || []
    : [];

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-navbar">
        <div className="auth-navbar-container">
          <Link to="/" className="auth-logo">TechFest</Link>
          <div className="auth-nav-actions">
            <Link to="/login" className="btn-outline btn-small">Login</Link>
            <Link to="/register" className="btn-primary btn-small">Register</Link>
          </div>
        </div>
      </header>

      {/* Auth Container */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join TechFest and start your journey</p>
          </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          {/* Basic Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Steve"
              />
              {errors.name && (
                <span className="error-text">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="steve123"
              />
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="steve12@example.com"
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="9876543210"
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Role selection (rid) */}
          <div className="form-group">
            <span className="form-label">Role</span>
            <div className="role-options">
              {ROLES.map((role) => (
                <label key={role.id} className="checkbox-label">
                  <input
                    type="radio"
                    name="rid"
                    value={role.id}
                    checked={String(formData.rid) === String(role.id)}
                    onChange={handleChange}
                  />
                  <span>{role.label}</span>
                </label>
              ))}
            </div>
            {errors.rid && <span className="error-text">{errors.rid}</span>}
          </div>

          {/* State and City */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stateId" className="form-label">
                State
              </label>
              <select
                id="stateId"
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                className={`form-input ${errors.stateId ? 'error' : ''}`}
              >
                <option value="">Select state</option>
                {STATES.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.stateId && (
                <span className="error-text">{errors.stateId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cityId" className="form-label">
                City
              </label>
              <select
                id="cityId"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className={`form-input ${errors.cityId ? 'error' : ''}`}
                disabled={!formData.stateId}
              >
                <option value="">
                  {formData.stateId ? 'Select city' : 'Select state first'}
                </option>
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.cityId && (
                <span className="error-text">{errors.cityId}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the Terms and Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
export default Register;
