import { useEffect, useState } from 'react';
import { useSession } from "@clerk/clerk-react";

interface User {
  _id: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
}

const Admin = () => {
  const { session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserEmail = session?.user.emailAddresses[0].emailAddress;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const updateUser = async (email: string, updates: { isAdmin?: boolean; isApproved?: boolean }) => {
    if (email === currentUserEmail) {
      setError("You cannot modify your own permissions");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      fetchUsers();
    } catch (error: unknown) {
      console.error('Update error:', error);
      setError('Failed to update user');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pt-20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage user access and permissions</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
          <span className="text-sm text-gray-600">
            Total Users: <span className="font-semibold text-indigo-600">{users.length}</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg shadow-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {/* Mobile View */}
              <div className="sm:hidden space-y-2 p-2">
                {users.map((user) => (
                  <div 
                    key={user._id}
                    className={`p-4 rounded-lg border ${
                      user.email === currentUserEmail 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-medium text-white">
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="truncate">
                            <div className="font-medium text-gray-900 truncate">
                              {user.email}
                            </div>
                            {user.email === currentUserEmail && (
                              <span className="inline-block mt-0.5 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full
                            ${user.isApproved 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}
                          >
                            {user.isApproved ? '✓ Approved' : '⌛ Pending'}
                          </span>
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full
                            ${user.isAdmin 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}
                          >
                            {user.isAdmin ? '👑 Admin' : '👤 User'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => updateUser(user.email, { isApproved: !user.isApproved })}
                        className={`py-2 px-4 text-sm font-medium rounded-lg transition-colors
                          ${user.email === currentUserEmail
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : user.isApproved
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                          }`}
                        disabled={user.email === currentUserEmail}
                      >
                        {user.isApproved ? '🚫 Revoke Access' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => updateUser(user.email, { isAdmin: !user.isAdmin })}
                        className={`py-2 px-4 text-sm font-medium rounded-lg transition-colors
                          ${user.email === currentUserEmail
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : user.isAdmin
                              ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                          }`}
                        disabled={user.email === currentUserEmail}
                      >
                        {user.isAdmin ? '👤 Remove Admin' : '👑 Make Admin'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className={user.email === currentUserEmail ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xl text-gray-600">{user.email[0].toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email}
                            </div>
                            {user.email === currentUserEmail && (
                              <div className="text-xs text-gray-500">(You)</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => updateUser(user.email, { isApproved: !user.isApproved })}
                          className={`mr-3 px-3 py-1 rounded-md ${
                            user.email === currentUserEmail
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          }`}
                          disabled={user.email === currentUserEmail}
                        >
                          {user.isApproved ? 'Revoke Access' : 'Approve'}
                        </button>
                        <button
                          onClick={() => updateUser(user.email, { isAdmin: !user.isAdmin })}
                          className={`px-3 py-1 rounded-md ${
                            user.email === currentUserEmail
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          }`}
                          disabled={user.email === currentUserEmail}
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
