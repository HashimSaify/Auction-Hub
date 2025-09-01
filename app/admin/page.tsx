'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, Gavel } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Sample data - replace with your actual data fetching
  const stats = {
    totalUsers: 1245,
    activeAuctions: 87,
    revenue: 125000,
    newUsers: 32
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="flex gap-2 overflow-x-auto">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'secondary'}
            onClick={() => setActiveTab('overview')}
            className="min-w-fit"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'secondary'}
            onClick={() => setActiveTab('users')}
            className="min-w-fit"
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button 
            variant={activeTab === 'auctions' ? 'default' : 'secondary'}
            onClick={() => setActiveTab('auctions')}
            className="min-w-fit"
          >
            <Gavel className="mr-2 h-4 w-4" />
            Auctions
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors">
              <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </Card>
            <Card className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors">
              <h3 className="text-sm font-medium text-gray-400">Active Auctions</h3>
              <p className="text-2xl font-bold">{stats.activeAuctions}</p>
            </Card>
            <Card className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors">
              <h3 className="text-sm font-medium text-gray-400">Revenue</h3>
              <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
            </Card>
            <Card className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors">
              <h3 className="text-sm font-medium text-gray-400">New Users (24h)</h3>
              <p className="text-2xl font-bold">{stats.newUsers}</p>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <Card className="p-6 bg-gray-800">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {/* Activity list would go here */}
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="p-6 bg-gray-800">
          <h2 className="text-xl font-bold mb-6">User Management</h2>
          {/* User management table would go here */}
        </Card>
      )}

      {activeTab === 'auctions' && (
        <Card className="p-6 bg-gray-800">
          <h2 className="text-xl font-bold mb-6">Auction Management</h2>
          {/* Auction management table would go here */}
        </Card>
      )}
    </div>
  )
}
