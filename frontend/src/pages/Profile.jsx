import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'
import { User, Mail, Lock, Edit, Save, X, Eye, EyeOff } from 'lucide-react'

const Profile = () => {
  const { backendUrl, token } = useContext(ShopContext)
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [originalData, setOriginalData] = useState({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const loadUserProfile = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/user/profile', {}, {
        headers: { token }
      })
      
      if (response.data.success) {
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          password: '••••••••' // Masked password
        }
        setUserProfile(userData)
        setOriginalData(userData)
      } else {
        toast.error(response.data.message || "Failed to load profile")
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalData(userProfile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUserProfile(originalData)
  }

  const handleSave = async () => {
    try {
      setUpdating(true)
      
      const updateData = {
        name: userProfile.name,
        email: userProfile.email
      }

      // Only include password if it's changed and not the masked version
      if (userProfile.password !== '••••••••' && userProfile.password.trim() !== '') {
        updateData.password = userProfile.password
      }

      const response = await axios.post(backendUrl + '/api/user/update-profile', updateData, {
        headers: { token }
      })
      
      if (response.data.success) {
        toast.success("Profile updated successfully!")
        setIsEditing(false)
        // Reload profile to get updated data
        loadUserProfile()
      } else {
        toast.error(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [token])

  if (loading) {
    return (
      <div className='border-t pt-16'>
        <div className='text-2xl mb-8'>
          <Title text1={'MY'} text2={'PROFILE'} />
        </div>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>
      
      <div className='max-w-2xl mx-auto'>
        {/* Profile Header */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-8 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center'>
                <User className='w-8 h-8' />
              </div>
              <div>
                <h2 className='text-2xl font-bold'>{userProfile.name}</h2>
                <p className='text-blue-100'>{userProfile.email}</p>
              </div>
            </div>
            <div className='flex gap-2'>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className='bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors'
                >
                  <Edit className='w-5 h-5' />
                </button>
              ) : (
                <div className='flex gap-2'>
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className='bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors disabled:opacity-50'
                  >
                    <Save className='w-5 h-5' />
                  </button>
                  <button
                    onClick={handleCancel}
                    className='bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className='bg-white rounded-b-2xl shadow-lg p-8'>
          <div className='space-y-6'>
            {/* Name Field */}
            <div className='group'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  name='name'
                  value={userProfile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder='Enter your full name'
                />
              </div>
            </div>

            {/* Email Field */}
            <div className='group'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='email'
                  name='email'
                  value={userProfile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder='Enter your email address'
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='group'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={userProfile.password}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditing 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder={isEditing ? 'Enter new password (leave blank to keep current)' : '••••••••'}
                />
                {isEditing && (
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                )}
              </div>
              {isEditing && (
                <p className='text-sm text-gray-500 mt-1'>
                  Leave blank to keep your current password
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className='flex gap-4 mt-8 pt-6 border-t'>
              <button
                onClick={handleSave}
                disabled={updating}
                className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {updating ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4' />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className='flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2'
              >
                <X className='w-4 h-4' />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile