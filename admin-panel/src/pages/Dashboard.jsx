import React from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
    // Hardcoded stats for now, can be fetched from API later
    const stats = [
        { title: 'Total Revenue', value: '₹1,20,400', icon: DollarSign, color: 'bg-green-500' },
        { title: 'Total Orders', value: '145', icon: ShoppingCart, color: 'bg-blue-500' },
        { title: 'Total Products', value: '24', icon: Package, color: 'bg-orange-500' },
        { title: 'Active Users', value: '1,203', icon: Users, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                            <div className={`p-4 rounded-full ${stat.color} bg-opacity-10 mr-4`}>
                                <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-center py-8">
                    Chart or Recent Orders Table can go here...
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
