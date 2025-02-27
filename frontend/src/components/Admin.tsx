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
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
  );
};

export default Admin;
