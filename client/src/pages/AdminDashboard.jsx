import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, campaignAPI } from '../api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('campaigns');
    const [stats, setStats] = useState({ totalUsers: 0, totalDonations: 0, totalAmountRaised: 0 });
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [usersPage, setUsersPage] = useState(1);
    const [donationsPage, setDonationsPage] = useState(1);
    const itemsPerPage = 10;

    // Campaign form state
    const [showCampaignForm, setShowCampaignForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [campaignForm, setCampaignForm] = useState({
        title: '',
        description: '',
        image: '',
        isActive: true
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dashboardRes, usersRes, donationsRes, campaignsRes] = await Promise.all([
                adminAPI.getDashboard(),
                adminAPI.getUsers(),
                adminAPI.getDonations(),
                campaignAPI.getAllAdmin()
            ]);

            setStats(dashboardRes.data);
            setUsers(usersRes.data.users);
            setDonations(donationsRes.data.donations);
            setCampaigns(campaignsRes.data.campaigns);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleCampaignSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            if (editingCampaign) {
                await campaignAPI.update(editingCampaign.id, campaignForm);
            } else {
                await campaignAPI.create(campaignForm);
            }

            setShowCampaignForm(false);
            setEditingCampaign(null);
            setCampaignForm({ title: '', description: '', image: '', isActive: true });
            await fetchData();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save campaign');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditCampaign = (campaign) => {
        setEditingCampaign(campaign);
        setCampaignForm({
            title: campaign.title,
            description: campaign.description,
            image: campaign.image || '',
            isActive: campaign.isActive
        });
        setShowCampaignForm(true);
    };

    const handleDeleteCampaign = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        try {
            await campaignAPI.delete(id);
            await fetchData();
        } catch (err) {
            alert('Failed to delete campaign');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            success: 'badge-success',
            failed: 'badge-failed',
            pending: 'badge-pending'
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-mesh">
            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white">Admin Dashboard</span>
                            <span className="hidden sm:inline text-slate-400 ml-2">• {user?.name}</span>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="hidden sm:inline">Logout</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Stats Cards */}
                <div className="m-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card card-hover animate-fadeIn">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Users</p>
                                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card card-hover animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Donations</p>
                                <p className="text-3xl font-bold text-white">{stats.totalDonations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card card-hover animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Campaigns</p>
                                <p className="text-3xl font-bold text-white">{campaigns.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card card-hover animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-pulse-glow">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Funds Raised</p>
                                <p className="text-3xl font-bold text-emerald-400">₹{stats.totalAmountRaised.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="m-4 card">
                    {/* Tab Headers */}
                    <div className="flex flex-wrap items-center justify-between gap-4 m-4">
                        <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl">
                            <button
                                onClick={() => setActiveTab('campaigns')}
                                className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'campaigns' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span className="hidden sm:inline">Campaigns</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="hidden sm:inline">Users</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('donations')}
                                className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'donations' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="hidden sm:inline">Donations</span>
                            </button>
                        </div>

                        {activeTab === 'campaigns' && (
                            <button
                                onClick={() => { setShowCampaignForm(true); setEditingCampaign(null); setCampaignForm({ title: '', description: '', image: '', isActive: true }); }}
                                className="btn-primary flex items-center gap-2 py-2 px-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Campaign
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'campaigns' && (
                        <div className="animate-fadeIn">
                            {campaigns.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    No campaigns created yet. Click "New Campaign" to create one.
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
                                    {campaigns.map((campaign) => (
                                        <div key={campaign.id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50">
                                            {campaign.image ? (
                                                <img src={campaign.image} alt={campaign.title} className="w-full h-40 sm:h-48 object-cover" />
                                            ) : (
                                                <div className="w-full h-32 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="text-white font-semibold truncate">{campaign.title}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${campaign.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/50 text-slate-400'}`}>
                                                        {campaign.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{campaign.description}</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-emerald-400 font-semibold">₹{campaign.totalRaised.toLocaleString()}</span>
                                                    <span className="text-slate-500">{campaign.donationCount} donations</span>
                                                </div>
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                                                    <button
                                                        onClick={() => handleEditCampaign(campaign)}
                                                        className="flex-1 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCampaign(campaign.id)}
                                                        className="flex-1 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-fadeIn">
                            <div className="table-container">
                                <table className="w-full">
                                    <thead className="table-header">
                                        <tr>
                                            <th className="table-cell text-left font-semibold">Name</th>
                                            <th className="table-cell text-left font-semibold">Email</th>
                                            <th className="table-cell text-left font-semibold">Role</th>
                                            <th className="table-cell text-left font-semibold">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {users.slice((usersPage - 1) * itemsPerPage, usersPage * itemsPerPage).map((u, index) => (
                                            <tr key={u.id || index} className="table-row">
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-white font-medium">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="table-cell text-slate-300">{u.email}</td>
                                                <td className="table-cell">
                                                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-600/50 text-slate-300 border border-slate-500/30'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="table-cell text-slate-400">{formatDate(u.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {users.length === 0 && (
                                <div className="text-center py-12 text-slate-400">No users registered yet</div>
                            )}
                            {users.length > itemsPerPage && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                                    <span className="text-slate-400 text-sm">
                                        Showing {(usersPage - 1) * itemsPerPage + 1} - {Math.min(usersPage * itemsPerPage, users.length)} of {users.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                                            disabled={usersPage === 1}
                                            className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setUsersPage(p => Math.min(Math.ceil(users.length / itemsPerPage), p + 1))}
                                            disabled={usersPage >= Math.ceil(users.length / itemsPerPage)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'donations' && (
                        <div className="animate-fadeIn">
                            <div className="table-container">
                                <table className="w-full">
                                    <thead className="table-header">
                                        <tr>
                                            <th className="table-cell text-left font-semibold">Campaign</th>
                                            <th className="table-cell text-left font-semibold">Donor</th>
                                            <th className="table-cell text-left font-semibold">Amount</th>
                                            <th className="table-cell text-left font-semibold">Status</th>
                                            <th className="table-cell text-left font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {donations.slice((donationsPage - 1) * itemsPerPage, donationsPage * itemsPerPage).map((d, index) => (
                                            <tr key={d.id || index} className="table-row">
                                                <td className="table-cell text-white font-medium">{d.campaign?.title || 'N/A'}</td>
                                                <td className="table-cell">
                                                    <div>
                                                        <p className="text-white font-medium">{d.user?.name || 'N/A'}</p>
                                                        <p className="text-slate-400 text-xs">{d.user?.email || ''}</p>
                                                    </div>
                                                </td>
                                                <td className="table-cell text-white font-semibold">
                                                    {d.currency === 'INR' ? '₹' : '$'}{d.amount.toLocaleString()}
                                                </td>
                                                <td className="table-cell">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${getStatusBadge(d.paymentStatus)}`}>
                                                        {d.paymentStatus.charAt(0).toUpperCase() + d.paymentStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="table-cell text-slate-400">{formatDate(d.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {donations.length === 0 && (
                                <div className="text-center py-12 text-slate-400">No donations recorded yet</div>
                            )}
                            {donations.length > itemsPerPage && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                                    <span className="text-slate-400 text-sm">
                                        Showing {(donationsPage - 1) * itemsPerPage + 1} - {Math.min(donationsPage * itemsPerPage, donations.length)} of {donations.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setDonationsPage(p => Math.max(1, p - 1))}
                                            disabled={donationsPage === 1}
                                            className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setDonationsPage(p => Math.min(Math.ceil(donations.length / itemsPerPage), p + 1))}
                                            disabled={donationsPage >= Math.ceil(donations.length / itemsPerPage)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Campaign Form Modal */}
            {showCampaignForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 border border-slate-700 animate-fadeIn">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                        </h3>

                        {formError && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                                <p className="text-red-400 text-sm">{formError}</p>
                            </div>
                        )}

                        <form onSubmit={handleCampaignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={campaignForm.title}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                                    placeholder="Campaign title"
                                    required
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    value={campaignForm.description}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                                    placeholder="Describe the campaign..."
                                    required
                                    rows={4}
                                    className="input resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Image URL (optional)</label>
                                <input
                                    type="url"
                                    value={campaignForm.image}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="input"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={campaignForm.isActive}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                                />
                                <label htmlFor="isActive" className="text-slate-300 text-sm">Active (visible to donors)</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowCampaignForm(false); setEditingCampaign(null); }}
                                    className="flex-1 py-3 rounded-xl font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 btn-primary py-3 flex items-center justify-center"
                                >
                                    {formLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        editingCampaign ? 'Update Campaign' : 'Create Campaign'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
