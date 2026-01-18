import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationAPI, campaignAPI } from '../api';
import DonationHistory from '../components/DonationHistory';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
        loadRazorpayScript();

        // Check if campaign was passed in URL
        const campaignParam = searchParams.get('campaign');
        if (campaignParam) {
            setSelectedCampaign(campaignParam);
        }
    }, [searchParams]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const fetchData = async () => {
        try {
            // Fetch campaigns (public endpoint - should always work)
            const campaignsRes = await campaignAPI.getAll();
            setCampaigns(campaignsRes.data.campaigns);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        }

        try {
            // Fetch donation history (requires auth)
            const historyRes = await donationAPI.getHistory();
            setDonations(historyRes.data.donations);
        } catch (err) {
            console.error('Error fetching history:', err);
        }

        setLoading(false);
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!selectedCampaign) {
            setError('Please select a campaign');
            return;
        }

        if (!amount || parseFloat(amount) < 1) {
            setError('Please enter a valid amount (minimum ₹1)');
            return;
        }

        setDonating(true);
        try {
            // Get Razorpay key
            const keyResponse = await donationAPI.getKey();
            const key = keyResponse.data.key;

            // Create order
            const orderResponse = await donationAPI.initiate({
                amount: parseFloat(amount),
                currency,
                campaignId: selectedCampaign
            });

            const { order, prefill } = orderResponse.data;
            const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);

            // Open Razorpay checkout
            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: 'HopeConnect',
                description: selectedCampaignData ? `Donation to ${selectedCampaignData.title}` : 'Donation',
                order_id: order.id,
                prefill: {
                    name: prefill.name,
                    email: prefill.email
                },
                theme: {
                    color: '#059669'
                },
                handler: async function (response) {
                    try {
                        const verifyResponse = await donationAPI.verify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyResponse.data.success) {
                            setSuccessMessage('🎉 Payment successful! Thank you for your generous donation.');
                            setAmount('');
                            await fetchData();
                        }
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                        await fetchData();
                    }
                },
                modal: {
                    ondismiss: async function () {
                        try {
                            await donationAPI.failed({ razorpay_order_id: order.id });
                            setError('Payment was cancelled.');
                            await fetchData();
                        } catch (err) {
                            console.error('Error marking payment as failed:', err);
                        }
                    }
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on('payment.failed', async function (response) {
                try {
                    await donationAPI.failed({ razorpay_order_id: order.id });
                    setError(`Payment failed: ${response.error.description}`);
                    await fetchData();
                } catch (err) {
                    console.error('Error handling payment failure:', err);
                }
            });

            razorpay.open();

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
        } finally {
            setDonating(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Calculate stats
    const successfulDonations = donations.filter(d => d.paymentStatus === 'success');
    const totalDonated = successfulDonations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-mesh">
            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-white">HopeConnect</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800/50"
                    >
                        <span className="hidden sm:inline text-sm">Logout</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">

                    {/* Left Column - Profile & Donate */}
                    <div className="flex flex-col gap-4 sm:gap-6 order-1 lg:order-1">
                        {/* Profile Card */}
                        <div className="card animate-fadeIn">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">{user?.name}</h2>
                                    <p className="text-slate-400 text-sm sm:text-base truncate">{user?.email}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                    <p className="text-slate-400 text-xs sm:text-sm">Total Donated</p>
                                    <p className="text-xl sm:text-2xl font-bold text-emerald-400">₹{totalDonated.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                    <p className="text-slate-400 text-xs sm:text-sm">Donations</p>
                                    <p className="text-xl sm:text-2xl font-bold text-white">{successfulDonations.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Donate Card */}
                        <div className="card animate-slideIn p-5 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Make a Donation
                            </h3>

                            {/* Messages */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 animate-fadeIn">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 animate-fadeIn">
                                    <p className="text-emerald-400 text-sm">{successMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleDonate} className="space-y-5">
                                {/* Campaign Selection */}
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">Select Campaign *</label>
                                    <select
                                        value={selectedCampaign}
                                        onChange={(e) => setSelectedCampaign(e.target.value)}
                                        className="input w-full text-base"
                                        required
                                    >
                                        <option value="">Choose a campaign...</option>
                                        {campaigns.map((campaign) => (
                                            <option key={campaign.id} value={campaign.id}>
                                                {campaign.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Currency Selection */}
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">Currency</label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="input w-full text-base"
                                    >
                                        <option value="INR">₹ INR - Indian Rupee</option>
                                        <option value="USD">$ USD - US Dollar</option>
                                    </select>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                            {currency === 'INR' ? '₹' : '$'}
                                        </span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            min="1"
                                            className="input w-full pl-12 text-lg text-center font-semibold"
                                        />
                                    </div>
                                </div>

                                {/* Quick Amount Buttons */}
                                <div>
                                    <label className="block text-slate-400 text-xs mb-2">Quick Select</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[100, 500, 1000, 5000].map((quickAmount) => (
                                            <button
                                                key={quickAmount}
                                                type="button"
                                                onClick={() => setAmount(quickAmount.toString())}
                                                className={`py-2.5 rounded-lg transition-all text-sm font-medium ${amount === quickAmount.toString()
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                                                    }`}
                                            >
                                                {currency === 'INR' ? '₹' : '$'}{quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={donating || campaigns.length === 0}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2"
                                >
                                    {donating ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                            Pay with Razorpay
                                        </>
                                    )}
                                </button>

                                {campaigns.length === 0 && (
                                    <p className="text-amber-400 text-xs text-center">No active campaigns available</p>
                                )}

                                {/* Razorpay Badge */}
                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="text-slate-500 text-xs">Secured by Razorpay</span>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - History */}
                    <div className="lg:col-span-2 order-2 lg:order-2">
                        <div className="card min-h-[400px] sm:min-h-[500px]">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Donation History
                            </h3>
                            <DonationHistory donations={donations} loading={loading} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
