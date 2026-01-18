import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { campaignAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const CampaignsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await campaignAPI.getAll();
            setCampaigns(response.data.campaigns);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDonate = (campaignId) => {
        if (user) {
            navigate(`/dashboard?campaign=${campaignId}`);
        } else {
            navigate('/auth');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-mesh">
            {/* Navigation */}
            <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">HopeConnect</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {user ? (
                                <Link to="/dashboard" className="btn-primary px-5 py-2">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/auth" className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors">
                                        Log in
                                    </Link>
                                    <Link to="/auth" className="btn-primary px-5 py-2">
                                        Join Us
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Active Campaigns</h1>
                        <p className="text-slate-400 text-lg">
                            Browse our ongoing campaigns and choose where your donation can make the biggest impact.
                        </p>
                    </div>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Active Campaigns</h3>
                        <p className="text-slate-400">Check back soon for new campaigns.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="card card-hover overflow-hidden">
                                {campaign.image ? (
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-52 object-cover" />
                                ) : (
                                    <div className="w-full h-52 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                        <svg className="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">{campaign.title}</h3>
                                    <p className="text-slate-400 text-sm mb-5 line-clamp-3">{campaign.description}</p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-700/50">
                                        <div>
                                            <p className="text-2xl font-bold text-emerald-400">₹{campaign.totalRaised.toLocaleString()}</p>
                                            <p className="text-slate-500 text-xs">raised so far</p>
                                        </div>
                                        <div className="border-l border-slate-700 pl-4">
                                            <p className="text-xl font-bold text-white">{campaign.donationCount}</p>
                                            <p className="text-slate-500 text-xs">donations</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDonate(campaign.id)}
                                        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        Donate Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-slate-900/50 border-t border-slate-700/50 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-white">HopeConnect</span>
                        </div>
                        <p className="text-slate-500 text-sm">© 2026 HopeConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CampaignsPage;
