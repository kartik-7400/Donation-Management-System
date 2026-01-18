import { useState, useMemo } from 'react';

const DonationHistory = ({ donations, loading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 5;

    const getStatusBadge = (status) => {
        const badges = {
            success: 'badge-success',
            failed: 'badge-failed',
            pending: 'badge-pending'
        };
        return badges[status] || badges.pending;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter and search donations
    const filteredDonations = useMemo(() => {
        if (!donations) return [];

        return donations.filter(donation => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchQuery === '' ||
                (donation.razorpayOrderId && donation.razorpayOrderId.toLowerCase().includes(searchLower)) ||
                (donation.razorpayPaymentId && donation.razorpayPaymentId.toLowerCase().includes(searchLower)) ||
                donation.amount.toString().includes(searchQuery);

            const matchesStatus = statusFilter === 'all' || donation.paymentStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [donations, searchQuery, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when filters change
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by Transaction ID or Amount..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="input pl-10 text-sm"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="input w-full sm:w-40 text-sm cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Results Count */}
            <p className="text-slate-400 text-sm">
                Showing {paginatedDonations.length} of {filteredDonations.length} donations
                {searchQuery && ` for "${searchQuery}"`}
            </p>

            {/* Empty State */}
            {filteredDonations.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-400">{donations?.length === 0 ? 'No donations yet' : 'No matching donations found'}</p>
                    <p className="text-slate-500 text-sm mt-1">
                        {donations?.length === 0 ? 'Your donation history will appear here' : 'Try adjusting your search or filter'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Table - Desktop */}
                    <div className="hidden md:block table-container">
                        <table className="w-full">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-cell text-left font-semibold">Transaction ID</th>
                                    <th className="table-cell text-left font-semibold">Amount</th>
                                    <th className="table-cell text-left font-semibold">Status</th>
                                    <th className="table-cell text-left font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {paginatedDonations.map((donation, index) => (
                                    <tr key={donation.id || index} className="table-row">
                                        <td className="table-cell text-white font-mono text-xs">
                                            {donation.razorpayPaymentId || donation.razorpayOrderId || 'N/A'}
                                        </td>
                                        <td className="table-cell text-white font-semibold">
                                            {donation.currency === 'INR' ? '₹' : '$'}{donation.amount.toLocaleString()}
                                        </td>
                                        <td className="table-cell">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(donation.paymentStatus)}`}>
                                                {getStatusIcon(donation.paymentStatus)}
                                                {donation.paymentStatus.charAt(0).toUpperCase() + donation.paymentStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="table-cell text-slate-400">
                                            {formatDate(donation.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards - Mobile */}
                    <div className="md:hidden space-y-3">
                        {paginatedDonations.map((donation, index) => (
                            <div key={donation.id || index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(donation.paymentStatus)}`}>
                                        {getStatusIcon(donation.paymentStatus)}
                                        {donation.paymentStatus.charAt(0).toUpperCase() + donation.paymentStatus.slice(1)}
                                    </span>
                                    <span className="text-white font-bold text-lg">
                                        {donation.currency === 'INR' ? '₹' : '$'}{donation.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 text-xs font-mono truncate">
                                        ID: {donation.razorpayPaymentId || donation.razorpayOrderId || 'N/A'}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        {formatDate(donation.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                            <p className="text-slate-400 text-sm order-2 sm:order-1">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2 order-1 sm:order-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="First page"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Previous page"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Page Numbers */}
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Next page"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Last page"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DonationHistory;
