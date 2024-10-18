import React, { useState } from 'react'

interface WalletHistoryItem {
    description: string;
    amount: string;
}

const DoctorWallet: React.FC = () => {
    const walletHistory: WalletHistoryItem[] = [
        { description: "Received Rs. 100.00", amount: "+ Rs. 100.00" },
        { description: "Sent Rs. 50.00", amount: "- Rs. 50.00" },
        { description: "Received Rs. 200.00", amount: "+ Rs. 200.00" },
        { description: "Sent Rs. 30.00", amount: "- Rs. 30.00" },
        { description: "Received Rs. 150.00", amount: "+ Rs. 150.00" },
        { description: "Sent Rs. 20.00", amount: "- Rs. 20.00" },
    ];

    const [newTransaction, setNewTransaction] = useState({ amount: '' });
    // const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([]);

    const handleAddTransaction = () => {
        alert("Not implemented")

    };

    return (
        <div className="flex flex-row items-center justify-center h-screen bg-gray-100 gap-10 px-20 ">
            <div className="bg-white p-6 rounded-xl shadow-2xl mb-4 w-1/2 h-64">
                <h1 className="text-3xl font-bold text-center mb-4">Wallet Balance</h1>
                <p className="text-3xl font-semibold text-green-600"> Rs. 500.00 </p>
                <div className="flex mt-10 gap-5 justify-center">
                    <input
                        type="text"
                        placeholder="Enter the amount"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        className='h-10 rounded-lg px-3 border border-gray-700'
                    />

                    <button className='bg-black text-white rounded-md w-24 font-medium' onClick={handleAddTransaction}>Add</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-xl w-1/2 h-3/4 overflow-y-auto ">
                <h2 className="text-xl font-bold mb-4">Wallet History</h2>
                <div className="flex flex-col space-y-4">
                    {walletHistory.map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <p className="text-gray-800">{item.description}</p>
                            <p className={item.amount.startsWith('-') ? "text-red-600" : "text-green-600"}>{item.amount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoctorWallet