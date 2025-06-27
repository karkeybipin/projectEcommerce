import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext)
  
  // Profile states
  const [user, setUser] = useState({
    name: '',
    email: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile',
        {},
        { headers: { token } }
      )
      
      if (response.data.success) {
        setUser({
          name: response.data.user.name,
          email: response.data.user.email
        })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to fetch profile')
    }
  }

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post(
        backendUrl + '/api/user/update-profile',
        {
          name: user.name,
          email: user.email
        },
        { headers: { token } }
      )
      
      if (response.data.success) {
        toast.success(response.data.message)
        setIsEditing(false)
        setUser({
          name: response.data.user.name,
          email: response.data.user.email
        })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (e) => {
    e.preventDefault()
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    
    setPasswordLoading(true)
    
    try {
      const response = await axios.post(
        backendUrl + '/api/user/change-password',
        passwordData,
        { headers: { token } }
      )
      
      if (response.data.success) {
        toast.success(response.data.message)
        setShowPasswordChange(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Cancel edit
  const cancelEdit = () => {
    setIsEditing(false)
    fetchUserProfile() // Reset to original data
  }

  // Cancel password change
  const cancelPasswordChange = () => {
    setShowPasswordChange(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchUserProfile()
  }, [token])

  if (!token) {
    return null
  }

  return (
    <div className='max-w-2xl mx-auto mt-8 p-6'>
      <div className='bg-white shadow-lg rounded-lg p-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>My Profile</h1>
        
        {/* Profile Information */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>Profile Information</h2>
          
          <form onSubmit={updateProfile}>
            <div className='grid grid-cols-1 gap-4'>
              {/* Name Field */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={user.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  required
                />
              </div>
              
              {/* Email Field */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  name='email'
                  value={user.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                  required
                />
              </div>
              
              {/* Password Field (Disabled) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <input
                  type='password'
                  value='••••••••••••'
                  disabled
                  className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Use "Change Password" button to update your password
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3 mt-6'>
              {!isEditing ? (
                <>
                  <button
                    type='button'
                    onClick={() => setIsEditing(true)}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    Edit Profile
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowPasswordChange(true)}
                    className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                  >
                    Change Password
                  </button>
                </>
              ) : (
                <>
                  <button
                    type='submit'
                    disabled={loading}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type='button'
                    onClick={cancelEdit}
                    className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500'
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        
        {/* Change Password Section */}
        {showPasswordChange && (
          <div className='border-t pt-8'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>Change Password</h2>
            
            <form onSubmit={changePassword}>
              <div className='grid grid-cols-1 gap-4'>
                {/* Current Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Current Password
                  </label>
                  <input
                    type='password'
                    name='currentPassword'
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your current password'
                    required
                  />
                </div>
                
                {/* New Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    New Password
                  </label>
                  <input
                    type='password'
                    name='newPassword'
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your new password'
                    minLength='8'
                    required
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                {/* Confirm New Password */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Confirm New Password
                  </label>
                  <input
                    type='password'
                    name='confirmPassword'
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Confirm your new password'
                    minLength='8'
                    required
                  />
                </div>
              </div>
              
              {/* Password Change Buttons */}
              <div className='flex flex-wrap gap-3 mt-6'>
                <button
                  type='submit'
                  disabled={passwordLoading}
                  className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type='button'
                  onClick={cancelPasswordChange}
                  className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile