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
        <div className="w-full min-h-screen bg-gradient-mesh">
            {/* Navigation */}
            <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white hidden sm:inline">HopeConnect</span>
                        </Link>

                        {/* Nav Links - Desktop */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#mission" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Our Mission</a>
                            <a href="#campaigns" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Campaigns</a>
                            <a href="#stats" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Impact</a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/auth" className="text-slate-300 hover:text-white font-medium px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors">
                                Log in
                            </Link>
                            <Link to="/auth" className="btn-primary px-4 sm:px-6 py-2 text-sm sm:text-base">
                                Join Us
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-emerald-400 text-sm font-medium">Trusted by 1000+ donors</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                            Every donation creates
                            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">lasting change.</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 mb-8 lg:mb-10 px-2">
                            Join HopeConnect's mission to empower communities. Every penny is tracked,
                            every impact measured, every life touched is celebrated.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/auth" className="btn-primary text-base sm:text-lg px-8 py-4 flex items-center justify-center gap-2 w-full sm:w-auto">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Start Giving
                            </Link>
                            <Link to="/campaigns" className="btn-secondary text-base sm:text-lg px-8 py-4 w-full sm:w-auto text-center">
                                View Campaigns
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Feature 1 */}
                        <div className="card card-hover p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Easy Registration</h3>
                            </div>
                            <p className="text-slate-400">
                                Create your account securely in seconds. Start making a difference immediately with our simple onboarding.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card card-hover p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Secure Payments</h3>
                            </div>
                            <p className="text-slate-400">
                                Bank-grade security with Razorpay. Your donations are processed safely and reach those in need.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card card-hover p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Track Impact</h3>
                            </div>
                            <p className="text-slate-400">
                                See exactly where your money goes. Real-time dashboard shows your contribution history and impact.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaigns Preview Section */}
            <section id="campaigns" className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Active Campaigns</h2>
                            <p className="text-slate-400">Choose a cause that resonates with you</p>
                        </div>
                        <Link to="/campaigns" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                            View all
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-12 card">
                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <p className="text-slate-400">No active campaigns at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="card card-hover overflow-hidden">
                                    {campaign.image ? (
                                        <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
                                    ) : (
                                        <div className="w-full h-48 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white mb-2">{campaign.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-emerald-400 font-bold">₹{campaign.totalRaised.toLocaleString()}</p>
                                                <p className="text-slate-500 text-xs">{campaign.donationCount} donations</p>
                                            </div>
                                            <Link
                                                to="/auth"
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
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

            {/* Mission Section */}
            <section id="mission" className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Choose HopeConnect?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">We believe in complete transparency and accountability for every donation.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card card-hover p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Our Mission</h3>
                            </div>
                            <p className="text-slate-400 text-sm">
                                To connect generous hearts with meaningful causes, ensuring every donation creates lasting positive change.
                            </p>
                        </div>

                        <div className="card card-hover p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Transparency</h3>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Complete visibility into how funds are used. Every transaction is recorded and accessible to donors.
                            </p>
                        </div>

                        <div className="card card-hover p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white">Real Impact</h3>
                            </div>
                            <p className="text-slate-400 text-sm">
                                See the real difference your donations make. We share stories and updates from communities you help.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card p-8 sm:p-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-emerald-400">
                                    {loading ? '...' : stats.totalMembers.toLocaleString()}
                                </p>
                                <p className="text-slate-400 mt-2">Active Members</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-emerald-400">
                                    {loading ? '...' : formatCurrency(stats.totalFundsRaised)}
                                </p>
                                <p className="text-slate-400 mt-2">Funds Raised</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-emerald-400">
                                    {loading ? '...' : stats.activeCampaigns}
                                </p>
                                <p className="text-slate-400 mt-2">Active Campaigns</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-emerald-400">
                                    100%
                                </p>
                                <p className="text-slate-400 mt-2">Transparency</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to make a difference?</h2>
                            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of donors who are creating lasting change in communities around the world.
                            </p>
                            <Link to="/auth" className="inline-flex items-center gap-2 bg-white text-emerald-600 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors text-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Get Started Today
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/50 border-t border-slate-700/50 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white block">HopeConnect</span>
                                <p className="text-slate-500 text-xs">Donation Management Platform</p>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm">© 2026 HopeConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
