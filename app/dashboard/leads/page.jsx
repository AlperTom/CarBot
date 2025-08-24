'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CalendarIcon,
  TruckIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock lead data for MVP
    const mockLeads = [
      {
        id: 1,
        name: 'Hans Mueller',
        email: 'hans.mueller@email.com',
        phone: '+49 30 12345678',
        vehicle: 'BMW 3er (2019)',
        service: 'Inspektion',
        status: 'new',
        created: '2024-08-23',
        priority: 'medium',
        source: 'Website Chat'
      },
      {
        id: 2,
        name: 'Anna Schmidt',
        email: 'anna.schmidt@email.com', 
        phone: '+49 40 87654321',
        vehicle: 'Audi A4 (2020)',
        service: 'Bremsenservice',
        status: 'contacted',
        created: '2024-08-22',
        priority: 'high',
        source: 'Telefon'
      },
      {
        id: 3,
        name: 'Michael Weber',
        email: 'michael.weber@email.com',
        phone: '+49 89 11223344',
        vehicle: 'Mercedes C-Klasse (2018)',
        service: 'Reifenwechsel',
        status: 'scheduled',
        created: '2024-08-21',
        priority: 'low',
        source: 'Website Formular'
      }
    ];
    
    setLeads(mockLeads);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'scheduled': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500', 
      'low': 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  const leadCounts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    scheduled: leads.filter(l => l.status === 'scheduled').length,
    completed: leads.filter(l => l.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Leads werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lead Management 🎯
              </h1>
              <p className="text-gray-600">
                Verwalten Sie alle eingehenden Anfragen und Interessenten
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                + Neuer Lead
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div 
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all ${
              filter === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            <div className="text-2xl font-bold text-gray-900">{leadCounts.all}</div>
            <div className="text-sm text-gray-600">Alle Leads</div>
          </div>
          
          <div 
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all ${
              filter === 'new' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setFilter('new')}
          >
            <div className="text-2xl font-bold text-blue-600">{leadCounts.new}</div>
            <div className="text-sm text-gray-600">Neu</div>
          </div>

          <div 
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all ${
              filter === 'contacted' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setFilter('contacted')}
          >
            <div className="text-2xl font-bold text-yellow-600">{leadCounts.contacted}</div>
            <div className="text-sm text-gray-600">Kontaktiert</div>
          </div>

          <div 
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all ${
              filter === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setFilter('scheduled')}
          >
            <div className="text-2xl font-bold text-green-600">{leadCounts.scheduled}</div>
            <div className="text-sm text-gray-600">Terminiert</div>
          </div>

          <div 
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all ${
              filter === 'completed' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setFilter('completed')}
          >
            <div className="text-2xl font-bold text-gray-600">{leadCounts.completed}</div>
            <div className="text-sm text-gray-600">Abgeschlossen</div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {filter === 'all' ? 'Alle Leads' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Leads`}
              <span className="ml-2 text-sm text-gray-500">({filteredLeads.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fahrzeug & Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Priorität
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Erstellt
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <EnvelopeIcon className="h-4 w-4 mr-1" />
                              {lead.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {lead.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <TruckIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {lead.vehicle}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {lead.service}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status === 'new' ? 'Neu' : 
                         lead.status === 'contacted' ? 'Kontaktiert' :
                         lead.status === 'scheduled' ? 'Terminiert' :
                         lead.status === 'completed' ? 'Abgeschlossen' : 
                         lead.status === 'cancelled' ? 'Storniert' : lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)} mr-2`}></div>
                        <span className="text-sm text-gray-600 capitalize">{lead.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(lead.created).toLocaleDateString('de-DE')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'Noch keine Leads vorhanden' 
                  : `Keine ${filter} Leads vorhanden`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}