import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import axios from 'axios'

const Payment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { ride } = location.state || {}

    const [showQR, setShowQR] = useState(false)
    const [confirming, setConfirming] = useState(false)

    const upiId = "736705572828@ybl"
    const name = "AutoVelo"
    const amount = ride?.fare || 0

    // UPI deep link
    const upiLink = amount
        ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('AutoVelo Ride Payment')}`
        : ""

    // Handle UPI app open
    const openUPIApp = (appPackage) => {
        // On mobile, upi:// deep link opens the UPI app selector
        // Some apps have specific intent URLs
        let deepLink = upiLink

        if (appPackage === 'gpay') {
            deepLink = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('AutoVelo Ride Payment')}`
        } else if (appPackage === 'phonepe') {
            deepLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('AutoVelo Ride Payment')}`
        } else if (appPackage === 'paytm') {
            deepLink = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('AutoVelo Ride Payment')}`
        }

        window.location.href = deepLink
    }

    // Open generic UPI intent (works on Android)
    const openGenericUPI = () => {
        window.location.href = upiLink
    }

    // Confirm payment
    const handleConfirmPayment = async () => {
        setConfirming(true)
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/payment-done`,
                { rideId: ride._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            alert("Payment Confirmed ✅")
            navigate('/home')
        } catch (err) {
            console.log(err)
            alert("Payment failed, please try again")
        } finally {
            setConfirming(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            color: '#e0e0e0'
        }}>

            {/* Back Button */}
            <div style={{
                width: '100%',
                maxWidth: 420,
                marginBottom: 10
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#aaa',
                        padding: '8px 16px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    ← Back
                </button>
            </div>

            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: 24
            }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💳</div>
                <h1 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0
                }}>
                    Pay for your ride
                </h1>
            </div>

            {/* Ride Info Card */}
            <div style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '16px 20px',
                width: '100%',
                maxWidth: 420,
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 20
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Driver</p>
                        <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#fff' }}>
                            {ride?.captain?.fullname?.firstname || "N/A"}{" "}
                            {ride?.captain?.fullname?.lastname || ""}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Vehicle</p>
                        <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 600, color: '#fff' }}>
                            {ride?.captain?.vehicle?.plate || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Fare Amount */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(76,175,80,0.15), rgba(76,175,80,0.05))',
                    borderRadius: 12,
                    padding: '14px 16px',
                    textAlign: 'center',
                    border: '1px solid rgba(76,175,80,0.2)'
                }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#4caf50' }}>Amount to Pay</p>
                    <p style={{
                        margin: '4px 0 0',
                        fontSize: 32,
                        fontWeight: 800,
                        color: '#fff'
                    }}>
                        ₹{amount}
                    </p>
                </div>
            </div>

            {/* UPI App Buttons */}
            <div style={{
                width: '100%',
                maxWidth: 420,
                marginBottom: 16
            }}>
                <p style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#aaa',
                    marginBottom: 12,
                    textAlign: 'center'
                }}>
                    Pay using UPI App
                </p>

                {/* Pay via Any UPI App (generic) */}
                <button
                    onClick={openGenericUPI}
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 14,
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)',
                        transition: 'transform 0.15s, box-shadow 0.15s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(108, 99, 255, 0.5)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(108, 99, 255, 0.3)'
                    }}
                >
                    📱 Pay ₹{amount} via UPI App
                </button>

                {/* Individual App Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 10
                }}>
                    <button
                        onClick={() => openUPIApp('gpay')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    >
                        <span style={{ fontSize: 24 }}>🟢</span>
                        Google Pay
                    </button>

                    <button
                        onClick={() => openUPIApp('phonepe')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    >
                        <span style={{ fontSize: 24 }}>🟣</span>
                        PhonePe
                    </button>

                    <button
                        onClick={() => openUPIApp('paytm')}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    >
                        <span style={{ fontSize: 24 }}>🔵</span>
                        Paytm
                    </button>
                </div>
            </div>

            {/* QR Code Toggle (for scanning from another device) */}
            <div style={{
                width: '100%',
                maxWidth: 420,
                marginBottom: 16
            }}>
                <button
                    onClick={() => setShowQR(!showQR)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        color: '#888',
                        fontSize: 13,
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                >
                    {showQR ? '▲ Hide QR Code' : '▼ Scan QR from another device'}
                </button>

                {showQR && amount > 0 && (
                    <div style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <QRCodeCanvas value={upiLink} size={180} />
                        <p style={{
                            margin: '12px 0 0',
                            fontSize: 12,
                            color: '#666'
                        }}>
                            Scan using any UPI app from another phone
                        </p>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div style={{
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '4px 0 16px'
            }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 12, color: '#666' }}>After payment</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* I Have Paid Button */}
            <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                style={{
                    width: '100%',
                    maxWidth: 420,
                    padding: '16px 20px',
                    background: confirming
                        ? 'rgba(76,175,80,0.3)'
                        : 'linear-gradient(135deg, #4caf50, #388e3c)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 17,
                    fontWeight: 700,
                    cursor: confirming ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    marginBottom: 12
                }}
                onMouseEnter={e => {
                    if (!confirming) {
                        e.currentTarget.style.transform = 'scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)'
                    }
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)'
                }}
            >
                {confirming ? '⏳ Confirming...' : '✅ I Have Paid'}
            </button>

            <p style={{
                fontSize: 11,
                color: '#555',
                textAlign: 'center',
                maxWidth: 420
            }}>
                Click "I Have Paid" after completing your payment to notify the driver
            </p>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default Payment