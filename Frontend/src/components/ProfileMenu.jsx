import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { CaptainDataContext } from '../context/CapatainContext';

const ProfileMenu = ({ userType }) => {
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [rideData, setRideData] = useState({ totalRides: 0, totalEarnings: 0, totalSpent: 0, rides: [] });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('rides'); // 'rides' or 'payments'
    const navigate = useNavigate();

    // Get context data as fallback
    const userCtx = useContext(UserDataContext);
    const captainCtx = useContext(CaptainDataContext);

    const contextProfile = userType === 'captain' ? captainCtx?.captain : userCtx?.user;

    // Fetch profile + ride history when panel opens
    useEffect(() => {
        if (open) {
            fetchProfileData();
        }
    }, [open]);

    const fetchProfileData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const headers = { Authorization: `Bearer ${token}` };

        try {
            // 👤 Fetch profile from DB
            const profileEndpoint = userType === 'captain'
                ? `${baseUrl}/captains/profile`
                : `${baseUrl}/users/profile`;

            const profileRes = await axios.get(profileEndpoint, { headers });
            const profileData = userType === 'captain'
                ? profileRes.data.captain || profileRes.data
                : profileRes.data;
            setProfile(profileData);

            // 📜 Fetch ride history from DB
            const historyEndpoint = userType === 'captain'
                ? `${baseUrl}/ride-history/captain`
                : `${baseUrl}/ride-history/user`;

            const historyRes = await axios.get(historyEndpoint, { headers });
            setRideData(historyRes.data);

        } catch (error) {
            console.error("Profile fetch error:", error);
            // Fallback to context data
            if (contextProfile) {
                setProfile(contextProfile);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    };

    // Get display name from profile
    const getDisplayName = () => {
        if (profile?.fullname) {
            const first = profile.fullname.firstname || '';
            const last = profile.fullname.lastname || '';
            return `${first} ${last}`.trim();
        }
        return userType === 'captain' ? 'Captain' : 'User';
    };

    const getInitial = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase() || 'P';
    };

    const getEmail = () => profile?.email || '';

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Format time
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    // Format distance
    const formatDistance = (meters) => {
        if (!meters) return '—';
        return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
    };

    return (
        <>
            {/* 🔘 Floating Profile Button */}
            <div
                onClick={() => setOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: 90,
                    right: 20,
                    width: 55,
                    height: 55,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 1000,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                }}
            >
                {getInitial()}
            </div>

            {/* 📂 PROFILE PANEL */}
            {open && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 1999,
                    animation: 'fadeIn 0.3s ease'
                }} onClick={() => setOpen(false)} />
            )}

            {open && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    maxHeight: '85%',
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    boxShadow: '0 -8px 30px rgba(0,0,0,0.5)',
                    padding: '20px 20px 30px',
                    zIndex: 2000,
                    overflowY: 'auto',
                    animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: '#e0e0e0',
                    fontFamily: "'Inter', 'Segoe UI', sans-serif"
                }}>

                    {/* Close Button */}
                    <div
                        onClick={() => setOpen(false)}
                        style={{
                            textAlign: 'right',
                            cursor: 'pointer',
                            fontSize: 22,
                            color: '#888',
                            padding: '0 5px 10px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888'}
                    >
                        ✕
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                border: '3px solid rgba(255,255,255,0.1)',
                                borderTopColor: '#6c63ff',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                                margin: '0 auto 15px'
                            }} />
                            <p style={{ color: '#888' }}>Loading profile...</p>
                        </div>
                    ) : (
                        <>
                            {/* 👤 Profile Info */}
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <div style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6c63ff 0%, #e91e63 100%)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 12px',
                                    fontSize: 28,
                                    fontWeight: 700,
                                    boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)'
                                }}>
                                    {getInitial()}
                                </div>

                                <h2 style={{
                                    margin: '0 0 4px',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: '#fff'
                                }}>
                                    {getDisplayName()}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: '#888'
                                }}>
                                    {getEmail()}
                                </p>
                                {userType === 'captain' && profile?.vehicle && (
                                    <p style={{
                                        margin: '6px 0 0',
                                        fontSize: 12,
                                        color: '#6c63ff',
                                        background: 'rgba(108, 99, 255, 0.1)',
                                        display: 'inline-block',
                                        padding: '3px 12px',
                                        borderRadius: 20
                                    }}>
                                        🚗 {profile.vehicle.vehicleType?.toUpperCase()} • {profile.vehicle.plate} • {profile.vehicle.color}
                                    </p>
                                )}
                            </div>

                            {/* 📊 Stats Cards */}
                            <div style={{
                                display: 'flex',
                                gap: 12,
                                marginBottom: 20
                            }}>
                                <div style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: 14,
                                    padding: '14px 16px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255,255,255,0.08)'
                                }}>
                                    <div style={{ fontSize: 24, marginBottom: 4 }}>🚗</div>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
                                        {rideData.totalRides}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                                        Total Rides
                                    </div>
                                </div>

                                <div style={{
                                    flex: 1,
                                    background: userType === 'captain'
                                        ? 'rgba(76, 175, 80, 0.1)'
                                        : 'rgba(255, 152, 0, 0.1)',
                                    borderRadius: 14,
                                    padding: '14px 16px',
                                    textAlign: 'center',
                                    border: userType === 'captain'
                                        ? '1px solid rgba(76, 175, 80, 0.2)'
                                        : '1px solid rgba(255, 152, 0, 0.2)'
                                }}>
                                    <div style={{ fontSize: 24, marginBottom: 4 }}>
                                        {userType === 'captain' ? '💰' : '💸'}
                                    </div>
                                    <div style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: userType === 'captain' ? '#4caf50' : '#ff9800'
                                    }}>
                                        ₹{userType === 'captain'
                                            ? (rideData.totalEarnings || 0).toFixed(0)
                                            : (rideData.totalSpent || 0).toFixed(0)
                                        }
                                    </div>
                                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                                        {userType === 'captain' ? 'Total Earnings' : 'Total Spent'}
                                    </div>
                                </div>

                                {userType === 'captain' && (
                                    <div style={{
                                        flex: 1,
                                        background: 'rgba(108, 99, 255, 0.1)',
                                        borderRadius: 14,
                                        padding: '14px 16px',
                                        textAlign: 'center',
                                        border: '1px solid rgba(108, 99, 255, 0.2)'
                                    }}>
                                        <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#6c63ff' }}>
                                            ₹{rideData.totalRides > 0
                                                ? ((rideData.totalEarnings || 0) / rideData.totalRides).toFixed(0)
                                                : 0}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                                            Avg/Ride
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 🔀 Tab Switcher */}
                            <div style={{
                                display: 'flex',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: 12,
                                padding: 3,
                                marginBottom: 16
                            }}>
                                <button
                                    onClick={() => setActiveTab('rides')}
                                    style={{
                                        flex: 1,
                                        padding: '8px 0',
                                        border: 'none',
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        background: activeTab === 'rides'
                                            ? 'linear-gradient(135deg, #6c63ff, #5a52d5)'
                                            : 'transparent',
                                        color: activeTab === 'rides' ? '#fff' : '#888',
                                        transition: 'all 0.25s ease'
                                    }}
                                >
                                    📜 Ride History
                                </button>
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    style={{
                                        flex: 1,
                                        padding: '8px 0',
                                        border: 'none',
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        background: activeTab === 'payments'
                                            ? 'linear-gradient(135deg, #6c63ff, #5a52d5)'
                                            : 'transparent',
                                        color: activeTab === 'payments' ? '#fff' : '#888',
                                        transition: 'all 0.25s ease'
                                    }}
                                >
                                    🧾 Payments
                                </button>
                            </div>

                            {/* 📜 Ride History Tab */}
                            {activeTab === 'rides' && (
                                <div style={{ marginBottom: 16 }}>
                                    {rideData.rides.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '30px 20px',
                                            color: '#666'
                                        }}>
                                            <div style={{ fontSize: 40, marginBottom: 10 }}>🛣️</div>
                                            <p style={{ margin: 0 }}>No rides yet</p>
                                            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555' }}>
                                                Your completed rides will appear here
                                            </p>
                                        </div>
                                    ) : (
                                        rideData.rides.map((ride, i) => (
                                            <div key={ride._id || i} style={{
                                                background: 'rgba(255,255,255,0.04)',
                                                padding: '12px 14px',
                                                borderRadius: 12,
                                                marginBottom: 8,
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                transition: 'background 0.2s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            color: '#fff',
                                                            marginBottom: 4
                                                        }}>
                                                            {ride.pickup?.address || 'Unknown'}
                                                            <span style={{ color: '#6c63ff', margin: '0 6px' }}>→</span>
                                                            {ride.destination?.address || 'Unknown'}
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 12,
                                                            fontSize: 11,
                                                            color: '#888'
                                                        }}>
                                                            <span>📅 {formatDate(ride.completedAt)}</span>
                                                            <span>🕐 {formatTime(ride.completedAt)}</span>
                                                            {ride.distance && (
                                                                <span>📏 {formatDistance(ride.distance)}</span>
                                                            )}
                                                        </div>
                                                        {/* Show rider/captain name */}
                                                        {userType === 'captain' && ride.user?.fullname && (
                                                            <div style={{ fontSize: 11, color: '#6c63ff', marginTop: 3 }}>
                                                                👤 {ride.user.fullname.firstname} {ride.user.fullname.lastname || ''}
                                                            </div>
                                                        )}
                                                        {userType === 'user' && ride.captain?.fullname && (
                                                            <div style={{ fontSize: 11, color: '#6c63ff', marginTop: 3 }}>
                                                                🧑‍✈️ {ride.captain.fullname.firstname} {ride.captain.fullname.lastname || ''}
                                                                {ride.captain.vehicle && (
                                                                    <span style={{ color: '#888' }}> • {ride.captain.vehicle.vehicleType}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{
                                                        textAlign: 'right',
                                                        marginLeft: 12,
                                                        flexShrink: 0
                                                    }}>
                                                        <div style={{
                                                            fontSize: 16,
                                                            fontWeight: 700,
                                                            color: '#fff'
                                                        }}>
                                                            ₹{ride.fare}
                                                        </div>
                                                        {userType === 'captain' && ride.captainEarnings && (
                                                            <div style={{
                                                                fontSize: 11,
                                                                color: '#4caf50',
                                                                marginTop: 2
                                                            }}>
                                                                Earned: ₹{ride.captainEarnings.toFixed(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* 🧾 Payment History Tab */}
                            {activeTab === 'payments' && (
                                <div style={{ marginBottom: 16 }}>
                                    {rideData.rides.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '30px 20px',
                                            color: '#666'
                                        }}>
                                            <div style={{ fontSize: 40, marginBottom: 10 }}>💳</div>
                                            <p style={{ margin: 0 }}>No payments yet</p>
                                        </div>
                                    ) : (
                                        rideData.rides.map((ride, i) => (
                                            <div key={ride._id || i} style={{
                                                background: 'rgba(255,255,255,0.04)',
                                                padding: '12px 14px',
                                                borderRadius: 12,
                                                marginBottom: 8,
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <div style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: '#fff',
                                                        marginBottom: 3
                                                    }}>
                                                        {userType === 'captain' ? '🟢 Ride Payment' : '🔵 Ride Fare'}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: '#888' }}>
                                                        {formatDate(ride.completedAt)} at {formatTime(ride.completedAt)}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                                                        {ride.pickup?.address?.split(',')[0]} → {ride.destination?.address?.split(',')[0]}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{
                                                        fontSize: 16,
                                                        fontWeight: 700,
                                                        color: userType === 'captain' ? '#4caf50' : '#ff9800'
                                                    }}>
                                                        {userType === 'captain' ? '+' : '-'}₹{
                                                            userType === 'captain'
                                                                ? (ride.captainEarnings || 0).toFixed(0)
                                                                : ride.fare
                                                        }
                                                    </div>
                                                    {userType === 'captain' && (
                                                        <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                                                            Platform fee: ₹{(ride.fare - (ride.captainEarnings || 0)).toFixed(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {/* Payment Summary */}
                                    {rideData.rides.length > 0 && (
                                        <div style={{
                                            background: 'rgba(108, 99, 255, 0.08)',
                                            borderRadius: 12,
                                            padding: '12px 16px',
                                            marginTop: 12,
                                            border: '1px solid rgba(108, 99, 255, 0.15)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: 13, color: '#aaa', fontWeight: 600 }}>
                                                Total ({rideData.totalRides} rides)
                                            </span>
                                            <span style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: userType === 'captain' ? '#4caf50' : '#ff9800'
                                            }}>
                                                ₹{userType === 'captain'
                                                    ? (rideData.totalEarnings || 0).toFixed(0)
                                                    : (rideData.totalSpent || 0).toFixed(0)
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 🔴 Logout */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    marginTop: 10,
                                    width: '100%',
                                    padding: 14,
                                    background: 'linear-gradient(135deg, #e53935, #c62828)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 12,
                                    fontSize: 15,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    boxShadow: '0 4px 15px rgba(229, 57, 53, 0.3)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 57, 53, 0.5)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(229, 57, 53, 0.3)';
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default ProfileMenu;