import { useState } from 'react';

const PaymentModal = ({ donation, onSuccess, onFailure, onClose }) => {
    const [processing, setProcessing] = useState(false);

    const handleSimulate = async (status) => {
        setProcessing(true);
        try {
            if (status === 'success') {
                await onSuccess(donation.transactionId);
            } else {
                await onFailure(donation.transactionId);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slideIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Gateway</h2>
                    <p className="text-slate-400">Sandbox Mode - Simulate Payment</p>
                </div>

                {/* Amount Display */}
                <div className="bg-slate-900/50 rounded-xl p-6 mb-8 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Amount to Pay</p>
                    <p className="text-4xl font-bold text-white">
                        {donation.currency === 'INR' ? '₹' : '$'}{donation.amount.toLocaleString()}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">Transaction ID: {donation.transactionId}</p>
                </div>

                {/* Simulation Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => handleSimulate('success')}
                        disabled={processing}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-semibold
                     hover:from-emerald-700 hover:to-green-700 transition-all duration-300 
                     shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Success
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => handleSimulate('failed')}
                        disabled={processing}
                        className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl font-semibold
                     hover:from-red-700 hover:to-rose-700 transition-all duration-300 
                     shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Failure
                            </>
                        )}
                    </button>
                </div>

                {/* Cancel Button */}
                <button
                    onClick={onClose}
                    disabled={processing}
                    className="w-full py-3 text-slate-400 hover:text-white transition-colors font-medium disabled:opacity-50"
                >
                    Cancel Payment
                </button>

                {/* Note */}
                <p className="text-center text-slate-500 text-xs mt-4">
                    This is a sandbox environment. No real payment will be processed.
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;
