import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ATTENDEE_API = 'http://localhost:8080/attendee';
const ORGANIZER_API = 'http://localhost:8080/organizer';

// Helper functions for state/city - handle all possible formats
const getStateId = s => s?.stateId ?? s?.StateId ?? s?.state_id ?? s?.id;
const getStateLabel = s => s?.sname ?? s?.Sname ?? s?.stateName ?? s?.name ?? '';
const getCityId = c => c?.cityId ?? c?.CityId ?? c?.city_id ?? c?.id;
const getCityStateId = c => c?.sid ?? c?.StateId ?? c?.stateId ?? c?.state_id ?? c?.stateId;
const getCityLabel = c => c?.cname ?? c?.Cname ?? c?.cityName ?? c?.name ?? '';

function AttendeeProfile() {
  const [formData, setFormData] = useState({
    dob: '',
    degreeId: '',
    branchId: '',
    address: '',
    stateId: '',
    cityId: '',
  });
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState('');

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

    fetchDropdowns();
  }, [navigate]);

  const fetchDropdowns = async () => {
    setIsLoadingData(true);
    setLoadError('');
    
    try {
      console.log('Fetching dropdown data...');
      
      const [degreesRes, branchesRes, statesRes, citiesRes] = await Promise.all([
        axios.get(`${ATTENDEE_API}/degrees`).catch(err => ({ data: [], error: err })),
        axios.get(`${ATTENDEE_API}/branches`).catch(err => ({ data: [], error: err })),
        axios.get(`${ORGANIZER_API}/states`).catch(err => ({ data: [], error: err })),
        axios.get(`${ORGANIZER_API}/cities`).catch(err => ({ data: [], error: err })),
      ]);

      // Handle degrees
      if (degreesRes.data && !degreesRes.error) {
        setDegrees(degreesRes.data);
        console.log('Degrees loaded:', degreesRes.data.length);
      } else {
        console.error('Failed to load degrees:', degreesRes.error);
      }

      // Handle branches
      if (branchesRes.data && !branchesRes.error) {
        setBranches(branchesRes.data);
        console.log('Branches loaded:', branchesRes.data.length);
      } else {
        console.error('Failed to load branches:', branchesRes.error);
      }

      // Handle states - CRITICAL
      if (statesRes.data && !statesRes.error && Array.isArray(statesRes.data)) {
        console.log('States API Response:', statesRes.data);
        console.log('First state sample:', statesRes.data[0]);
        if (statesRes.data.length > 0) {
          console.log('State keys:', Object.keys(statesRes.data[0]));
        }
        setStates(statesRes.data);
        console.log(`✅ Loaded ${statesRes.data.length} states`);
      } else {
        console.error('❌ Failed to load states:', statesRes.error || 'Invalid response');
        setLoadError('Failed to load states. Please ensure backend is running on port 5041.');
      }

      // Handle cities
      if (citiesRes.data && !citiesRes.error && Array.isArray(citiesRes.data)) {
        setCities(citiesRes.data);
        console.log(`✅ Loaded ${citiesRes.data.length} cities`);
      } else {
        console.error('Failed to load cities:', citiesRes.error);
      }

    } catch (err) {
      console.error('Error fetching dropdowns:', err);
      setLoadError('Failed to load form data. Please check if backend services are running.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      // Reset city when state changes
      if (name === 'stateId') {
        newData.cityId = '';
      }
      
      return newData;
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

    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const uid = user?.uid ?? user?.UID ?? user?.id ?? user?.userId ?? user?.user_id ?? null;
    if (!uid) {
      setErrors({ submit: 'Your login session is missing uid. Please logout and login again.' });
      return;
    }

    const degreeIdNum = Number(formData.degreeId);
    const branchIdNum = Number(formData.branchId);
    const stateIdNum = Number(formData.stateId);
    const cityIdNum = Number(formData.cityId);
    
    if (
      !Number.isFinite(degreeIdNum) ||
      !Number.isFinite(branchIdNum) ||
      degreeIdNum <= 0 ||
      branchIdNum <= 0 ||
      !Number.isFinite(stateIdNum) ||
      !Number.isFinite(cityIdNum) ||
      stateIdNum <= 0 ||
      cityIdNum <= 0
    ) {
      setErrors({ submit: 'Please select valid degree, branch, state, and city.' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${ATTENDEE_API}/profile`, {
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
          stateId: stateIdNum,
          cityId: cityIdNum,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Failed to save profile');
      }

      await response.json();
      alert('Profile completed successfully!');
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
    <div className="min-vh-100 bg-light">
      {/* Attendee Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            TechFest
          </a>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              {user?.name || user?.username || 'User'}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white py-4">
                <h2 className="card-title mb-1 fw-bold">Complete Your Profile</h2>
                <p className="card-text mb-0 opacity-90">
                  Welcome, {user?.name || user?.username || 'User'}! Please complete your attendee profile to continue.
                </p>
              </div>
              
              <div className="card-body p-4">
                {loadError && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>
                      <strong>Error:</strong> {loadError}
                      <br />
                      <small>Please ensure backend is running on port 5041 and database has state records.</small>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                {isLoadingData && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading form data...</p>
                  </div>
                )}

                {!isLoadingData && (
                  <form onSubmit={handleSubmit}>
                    {/* Date of Birth */}
                    <div className="mb-3">
                      <label htmlFor="dob" className="form-label fw-semibold">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                      {errors.dob && (
                        <div className="invalid-feedback">{errors.dob}</div>
                      )}
                    </div>

                    {/* Degree and Branch */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="degreeId" className="form-label fw-semibold">
                          Degree <span className="text-danger">*</span>
                        </label>
                        <select
                          id="degreeId"
                          name="degreeId"
                          value={formData.degreeId}
                          onChange={handleChange}
                          className={`form-select ${errors.degreeId ? 'is-invalid' : ''}`}
                          disabled={isLoadingData}
                          required
                        >
                          <option value="">Select degree</option>
                          {degrees.map((degree) => (
                            <option key={degree.degreeId} value={degree.degreeId}>
                              {degree.dname}
                            </option>
                          ))}
                        </select>
                        {errors.degreeId && (
                          <div className="invalid-feedback">{errors.degreeId}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="branchId" className="form-label fw-semibold">
                          Branch <span className="text-danger">*</span>
                        </label>
                        <select
                          id="branchId"
                          name="branchId"
                          value={formData.branchId}
                          onChange={handleChange}
                          className={`form-select ${errors.branchId ? 'is-invalid' : ''}`}
                          disabled={isLoadingData}
                          required
                        >
                          <option value="">Select branch</option>
                          {branches.map((branch) => (
                            <option key={branch.bid} value={branch.bid}>
                              {branch.bname}
                            </option>
                          ))}
                        </select>
                        {errors.branchId && (
                          <div className="invalid-feedback">{errors.branchId}</div>
                        )}
                      </div>
                    </div>

                    {/* State and City */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="stateId" className="form-label fw-semibold">
                          State <span className="text-danger">*</span>
                        </label>
                        <select
                          id="stateId"
                          name="stateId"
                          value={formData.stateId}
                          onChange={handleChange}
                          className={`form-select ${errors.stateId ? 'is-invalid' : ''}`}
                          disabled={isLoadingData}
                          required
                        >
                          <option value="">Select state</option>
                          {states.map((state, idx) => {
                            const stateId = getStateId(state);
                            const stateLabel = getStateLabel(state);
                            return (
                              <option key={stateId || idx} value={stateId || ''}>
                                {stateLabel || `State ${stateId}`}
                              </option>
                            );
                          })}
                        </select>
                        {errors.stateId && (
                          <div className="invalid-feedback">{errors.stateId}</div>
                        )}
                        {states.length === 0 && !isLoadingData && (
                          <small className="text-danger d-block mt-1">
                            No states available. Please check backend connection.
                          </small>
                        )}
                        {states.length > 0 && (
                          <small className="text-success d-block mt-1">
                            {states.length} state(s) loaded
                          </small>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="cityId" className="form-label fw-semibold">
                          City <span className="text-danger">*</span>
                        </label>
                        <select
                          id="cityId"
                          name="cityId"
                          value={formData.cityId}
                          onChange={handleChange}
                          className={`form-select ${errors.cityId ? 'is-invalid' : ''}`}
                          disabled={isLoadingData || !formData.stateId}
                          required
                        >
                          <option value="">Select city</option>
                          {cities
                            .filter(c => formData.stateId ? getCityStateId(c) === Number(formData.stateId) : false)
                            .map((city, idx) => {
                              const cityId = getCityId(city);
                              const cityLabel = getCityLabel(city);
                              return (
                                <option key={cityId || idx} value={cityId || ''}>
                                  {cityLabel || `City ${cityId}`}
                                </option>
                              );
                            })}
                        </select>
                        {errors.cityId && (
                          <div className="invalid-feedback">{errors.cityId}</div>
                        )}
                        {formData.stateId && !formData.cityId && (
                          <small className="text-muted d-block mt-1">
                            Please select a city
                          </small>
                        )}
                        {formData.stateId && cities.filter(c => getCityStateId(c) === Number(formData.stateId)).length === 0 && (
                          <small className="text-warning d-block mt-1">
                            No cities found for selected state
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <label htmlFor="address" className="form-label fw-semibold">
                        Address <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        placeholder="Enter your full address (minimum 10 characters)"
                        rows="3"
                        required
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isLoading || isLoadingData}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving Profile...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Save Profile & Continue
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendeeProfile;
