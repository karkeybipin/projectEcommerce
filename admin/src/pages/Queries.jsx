import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Queries = ({ token }) => {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        backendUrl + '/api/contact/list',
        { headers: { token } }
      )
      
      if (response.data.success) {
        setQueries(response.data.queries)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch queries')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading queries...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">Customer Queries</p>
        <p className="text-sm text-gray-500">Total: {queries.length}</p>
      </div>

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_2fr_1fr] items-center py-3 px-4 border bg-gray-100 text-sm font-medium">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Address</div>
          <div>Query</div>
          <div>Date</div>
        </div>

        {/* Queries List */}
        {queries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No queries found
          </div>
        ) : (
          queries.map((query, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr_1fr] items-start gap-2 py-3 px-4 border text-sm hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-800">
                {query.name}
              </div>
              <div className="text-gray-600 break-all">
                {query.email}
              </div>
              <div className="text-gray-600">
                {query.phone || 'N/A'}
              </div>
              <div className="text-gray-600">
                {query.address || 'N/A'}
              </div>
              <div className="text-gray-700">
                <div className="max-w-xs overflow-hidden">
                  <p className="line-clamp-3">{query.queries}</p>
                  {query.queries.length > 100 && (
                    <button 
                      onClick={() => {
                        const modal = document.createElement('div')
                        modal.innerHTML = `
                          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div class="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                              <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold">Full Query</h3>
                                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-xl">×</button>
                              </div>
                              <div class="space-y-2 mb-4">
                                <p><strong>Name:</strong> ${query.name}</p>
                                <p><strong>Email:</strong> ${query.email}</p>
                                <p><strong>Phone:</strong> ${query.phone || 'N/A'}</p>
                                <p><strong>Address:</strong> ${query.address || 'N/A'}</p>
                                <p><strong>Date:</strong> ${formatDate(query.createdAt)}</p>
                              </div>
                              <div>
                                <strong>Query:</strong>
                                <p class="mt-2 p-3 bg-gray-100 rounded whitespace-pre-wrap">${query.queries}</p>
                              </div>
                            </div>
                          </div>
                        `
                        document.body.appendChild(modal)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                    >
                      Read more...
                    </button>
                  )}
                </div>
              </div>
              <div className="text-gray-500 text-xs">
                {formatDate(query.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {queries.map((query, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{query.name}</h3>
              <span className="text-xs text-gray-500">{formatDate(query.createdAt)}</span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Email:</span> {query.email}</p>
              {query.phone && <p><span className="font-medium">Phone:</span> {query.phone}</p>}
              {query.address && <p><span className="font-medium">Address:</span> {query.address}</p>}
              <div className="mt-2">
                <span className="font-medium">Query:</span>
                <p className="mt-1 p-2 bg-gray-100 rounded text-gray-700 whitespace-pre-wrap">
                  {query.queries}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Queries