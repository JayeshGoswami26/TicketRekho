"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Users,
  User,
  MessageSquare,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  Search,
  X,
  UserCheck,
  Globe,
} from "lucide-react"
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb"
import url from "../networking/app_urls"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import MultiSelectDropdown from "../components/Dropdowns/MultiSelectDropdown"

interface AppUser {
  _id: string
  name: string
  email: string
  mobileNumber: string
}

const Notification: React.FC = () => {
  const { id } = useParams()
  const currentUser = useSelector((state: any) => state.user.currentUser?.data)

  const [users, setUsers] = useState<AppUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([])
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usersLoading, setUsersLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        const response = await axios.get(`${url.getAllUserList}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        })
        setUsers(response.data.data)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users")
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [currentUser.token])

  // Smart type detection with animations
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setType("")
    } else if (selectedUsers.length === 1) {
      setType("Single")
    } else if (selectedUsers.length === users.length) {
      setType("All")
    } else {
      setType("Multiple")
    }
  }, [selectedUsers, users])

  const resetForm = () => {
    setSelectedUsers([])
    setType("")
    setTitle("")
    setDescription("")
    setErrorMessage(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!type) return setErrorMessage("Please select users.")
    if (!title.trim()) return setErrorMessage("Please enter a title.")
    if (!description.trim()) return setErrorMessage("Please enter a description.")

    setLoading(true)
    setErrorMessage(null)

    try {
      if (type === "Single") {
        await axios.post(
          url.sendNotificationsToSingleUser,
          {
            appUserId: selectedUsers[0]._id,
            title,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              "Content-Type": "application/json",
            },
          },
        )
      } else {
        await axios.post(
          url.sendNotificationsToUsers,
          {
            title,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              "Content-Type": "application/json",
            },
          },
        )
      }

      toast.success("Notification sent successfully!")
      resetForm()
    } catch (error) {
      toast.error("Failed to send notification.")
      setErrorMessage("Failed to send notification. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "Single":
        return <User size={16} className="text-blue-500" />
      case "Multiple":
        return <Users size={16} className="text-green-500" />
      case "All":
        return <Globe size={16} className="text-yellow-500" />
      default:
        return <UserCheck size={16} className="text-gray-400" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "Single":
        return "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
      case "Multiple":
        return "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
      case "All":
        return "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400"
      default:
        return "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Breadcrumb pageName="Notifications" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="bg-indigo-purple rounded-2xl p-8 text-white">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-white/20 rounded-xl">
                  <Bell size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Send Notifications</h1>
                  <p className="text-white/80 mt-2">Communicate with your users instantly and effectively</p>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    <span className="font-semibold">Total Users</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{usersLoading ? "..." : users.length.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <UserCheck size={20} />
                    <span className="font-semibold">Selected</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{selectedUsers.length.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon()}
                    <span className="font-semibold">Type</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{type || "None"}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Column - User Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Recipients</h2>
                  </div>

                  {/* User Selection */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Search size={16} className="text-indigo-500" />
                      Choose Users
                    </label>
                    <MultiSelectDropdown
                      options={users}
                      selectedOptions={selectedUsers}
                      onChange={setSelectedUsers}
                      placeholder="Search & select users..."
                      searchPlaceholder="Search by name, email, phone..."
                      loading={usersLoading}
                    />
                  </div>

                  {/* Type Indicator */}
                  <AnimatePresence>
                    {type && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-4 rounded-xl border-2 ${getTypeColor()}`}
                      >
                        <div className="flex items-center gap-2">
                          {getTypeIcon()}
                          <span className="font-semibold">
                            {type === "Single" && "Single User"}
                            {type === "Multiple" && `${selectedUsers.length} Users Selected`}
                            {type === "All" && "All Users"}
                          </span>
                        </div>
                        <p className="text-sm mt-1 opacity-80">
                          {type === "Single" && "Notification will be sent to one user"}
                          {type === "Multiple" && "Notification will be sent to selected users"}
                          {type === "All" && "Notification will be sent to all users"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selected Users Preview */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <UserCheck size={16} className="text-indigo-500" />
                      Selected Users ({selectedUsers.length})
                    </label>
                    <div className="h-48 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                      <div className="h-full overflow-y-auto p-4">
                        <AnimatePresence>
                          {selectedUsers.length > 0 ? (
                            <motion.div className="space-y-2">
                              {selectedUsers.map((user, index) => (
                                <motion.div
                                  key={user._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-purple rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                                        {user.name || "No Name"}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.email || user.mobileNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <motion.button
                                    type="button"
                                    onClick={() => setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id))}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X size={14} className="text-red-500" />
                                  </motion.button>
                                </motion.div>
                              ))}
                            </motion.div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <Users size={32} className="text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No users selected</p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                  Use the dropdown above to select recipients
                                </p>
                              </div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Message Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MessageSquare size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Message Content</h2>
                  </div>

                  {/* Title */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FileText size={16} className="text-indigo-500" />
                      Notification Title
                    </label>
                    <motion.input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a compelling title..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                      whileFocus={{ scale: 1.01 }}
                      maxLength={100}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Keep it short and engaging</span>
                      <span>{title.length}/100</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MessageSquare size={16} className="text-indigo-500" />
                      Message Content
                    </label>
                    <motion.textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write your message here..."
                      rows={8}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                      whileFocus={{ scale: 1.01 }}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Clear and actionable message</span>
                      <span>{description.length}/500</span>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Bell size={14} />
                      Preview
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {title || "Your notification title"}
                      </h4>
                      <textarea className="w-full min-h-30 text-gray-600 dark:text-gray-400 text-sm mt-1 " placeholder={'Your message content will appear here...'} value={description}>
                        {/* {description || "Your message content will appear here..."} */}
                      </textarea>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400"
                  >
                    <AlertCircle size={20} />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex justify-end"
              >
                <motion.button
                  type="submit"
                  disabled={loading || !type || !title.trim() || !description.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Notification
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Notification
