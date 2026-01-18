import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, campaignAPI } from '../api';

const LandingPage = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalFundsRaised: 0,
        activeCampaigns: 0,
        dataIntegrity: 100
    });
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, campaignsRes] = await Promise.all([
                statsAPI.getPublic(),
                campaignAPI.getAll()
            ]);
            setStats(statsRes.data);
            setCampaigns(campaignsRes.data.campaigns.slice(0, 3)); // Show first 3
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount.toLocaleString()}`;
    };

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="px-4 w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-slate-800 hidden sm:inline">HopeConnect</span>
                        </Link>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/auth" className="text-slate-600 hover:text-slate-900 font-medium px-3 sm:px-4 py-2 text-sm sm:text-base rounded transition-colors">
                                Log in
                            </Link>
                            <Link to="/auth" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 sm:px-5 py-2 rounded-lg transition-colors text-sm sm:text-base">
                                Join
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 py-12 sm:py-20 lg:py-32">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6">
                            Make a tangible difference.
                            <span className="block text-emerald-600">Track every penny.</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 lg:mb-10 px-2">
                            Join HopeConnect's mission to create real impact. Every donation is tracked,
                            every penny accounted for, and every life touched is celebrated.
                        </p>
                        <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link to="/auth" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 w-full sm:w-auto">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="hidden sm:inline">Register as Member</span>
                                <span className="sm:hidden">Register</span>
                            </Link>
                            <Link to="/campaigns" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
                                View Campaigns
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Feature 1 */}
                        <div className="card-light p-6 sm:p-8">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Independent Registration</h3>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-base">
                                Create your account securely and independently. Your data is protected and your privacy is our priority.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card-light p-6 sm:p-8">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Secure Transactions</h3>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-base">
                                All transactions are processed through Razorpay with bank-grade security. Your donations are safe.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card-light p-6 sm:p-8">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 sm:w-7 h-6 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Live Dashboard</h3>
                            </div>
                            <p className="text-slate-600 text-sm sm:text-base">
                                Track your donations in real-time. View your contribution history and see the impact you're making.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaigns Preview Section */}
            <section id="campaigns" className="py-12 sm:py-16 md:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Active Campaigns</h2>
                        <Link to="/campaigns" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 whitespace-nowrap">
                            View all
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-slate-500">No active campaigns at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                                    {campaign.image ? (
                                        <img src={campaign.image} alt={campaign.title} className="w-full h-40 sm:h-48 object-cover" />
                                    ) : (
                                        <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                            <svg className="w-12 sm:w-16 h-12 sm:h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{campaign.title}</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-2">{campaign.description}</p>
                                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-emerald-400 font-semibold">₹{campaign.totalRaised.toLocaleString()}</span>
                                                <span className="text-slate-500">{campaign.donationCount} donations</span>
                                            </div>
                                            <Link
                                                to="/auth"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-colors text-center xs:text-left"
                                            >
                                                Donate
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Mission, Transparency, Impact Section */}
            <section id="mission" className="py-12 sm:py-16 md:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8 sm:mb-10 md:mb-12">Why Choose HopeConnect?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow" id="transparency">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">Our Mission</h3>
                            </div>
                            <p className="text-slate-600 text-sm">
                                To connect generous hearts with meaningful causes, ensuring every donation creates lasting positive change in communities.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">Transparency</h3>
                            </div>
                            <p className="text-slate-600 text-sm">
                                Complete visibility into how funds are used. Every transaction is recorded and accessible to donors at any time.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">Real Impact</h3>
                            </div>
                            <p className="text-slate-600 text-sm">
                                See the real difference your donations make. We share stories and updates from the communities you help.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-14 md:py-16 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600">
                                {loading ? '...' : stats.totalMembers.toLocaleString()}
                            </p>
                            <p className="text-slate-600 mt-2 text-sm sm:text-base">Members</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600">
                                {loading ? '...' : formatCurrency(stats.totalFundsRaised)}
                            </p>
                            <p className="text-slate-600 mt-2 text-sm sm:text-base">Funds raised</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600">
                                {loading ? '...' : stats.activeCampaigns}
                            </p>
                            <p className="text-slate-600 mt-2 text-sm sm:text-base">Active campaigns</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600">
                                {stats.dataIntegrity}%
                            </p>
                            <p className="text-slate-600 mt-2 text-sm sm:text-base">Data Integrity</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="text-lg font-bold text-slate-800 block">HopeConnect</span>
                                <p className="text-slate-500 text-xs">Donation Management Platform</p>
                            </div>
                        </div>

                        <p className="text-slate-500 text-xs sm:text-sm">© 2026 All rights reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
