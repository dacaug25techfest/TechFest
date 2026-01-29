import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function AttendeeProfile() {
  const [formData, setFormData] = useState({
    dob: '',
    degreeId: '',
    branchId: '',
    address: '',
  });
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const navigate = useNavigate();

  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDropdowns = async () => {
      setIsLoadingData(true);
      try {
        const [degreesRes, branchesRes] = await Promise.all([
          fetch('http://localhost:8082/api/attendee/degrees'),
          fetch('http://localhost:8082/api/attendee/branches'),
        ]);

        if (degreesRes.ok) {
          const degreesData = await degreesRes.json();
          setDegrees(degreesData);
        }

        if (branchesRes.ok) {
          const branchesData = await branchesRes.json();
          setBranches(branchesData);
        }
      } catch (err) {
        console.error('Error fetching dropdowns:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDropdowns();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) {
        newErrors.dob = 'Date of birth must be in the past';
      }
    }

    if (!formData.degreeId) {
      newErrors.degreeId = 'Please select a degree';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Please select a branch';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const uid =
      user?.uid ?? user?.UID ?? user?.id ?? user?.userId ?? user?.user_id ?? null;
    if (!uid) {
      setErrors({ submit: 'Your login session is missing uid. Please logout and login again.' });
      return;
    }

    const degreeIdNum = Number(formData.degreeId);
    const branchIdNum = Number(formData.branchId);
    if (
      !Number.isFinite(degreeIdNum) ||
      !Number.isFinite(branchIdNum) ||
      degreeIdNum <= 0 ||
      branchIdNum <= 0
    ) {
      setErrors({ submit: 'Please select valid degree and branch.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8082/api/attendee/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: Number(uid),
          dob: formData.dob,
          degreeId: degreeIdNum,
          branchId: branchIdNum,
          address: formData.address.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Failed to save profile');
      }

      await response.json();
      navigate('/attendee/events');
    } catch (error) {
      console.error('Profile save error:', error);
      setErrors({ submit: error.message || 'Failed to save profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const user = getCurrentUser();

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-navbar">
        <div className="auth-navbar-container">
          <div className="auth-logo">TechFest</div>
          <div className="auth-nav-actions">
            <button
              type="button"
              className="btn-outline btn-small"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Auth Container */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Complete Your Profile</h1>
            <p className="auth-subtitle">
              Welcome, {user?.name || user?.username || 'User'}! Please complete your attendee profile to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && (
              <div className="error-message">{errors.submit}</div>
            )}

            {isLoadingData && (
              <p className="section-subtitle">Loading form data...</p>
            )}

            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`form-input ${errors.dob ? 'error' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dob && (
                <span className="error-text">{errors.dob}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="degreeId" className="form-label">
                  Degree
                </label>
                <select
                  id="degreeId"
                  name="degreeId"
                  value={formData.degreeId}
                  onChange={handleChange}
                  className={`form-input ${errors.degreeId ? 'error' : ''}`}
                  disabled={isLoadingData}
                >
                  <option value="">Select degree</option>
                  {degrees.map((degree) => (
                    <option key={degree.degreeId} value={degree.degreeId}>
                      {degree.dname}
                    </option>
                  ))}
                </select>
                {errors.degreeId && (
                  <span className="error-text">{errors.degreeId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="branchId" className="form-label">
                  Branch
                </label>
                <select
                  id="branchId"
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className={`form-input ${errors.branchId ? 'error' : ''}`}
                  disabled={isLoadingData}
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch.bid} value={branch.bid}>
                      {branch.bname}
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <span className="error-text">{errors.branchId}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="Enter your full address"
                rows="3"
              />
              {errors.address && (
                <span className="error-text">{errors.address}</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading || isLoadingData}
            >
              {isLoading ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AttendeeProfile;
