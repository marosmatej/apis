import React, { useState } from 'react';

import { useAuth } from '../../../context/AuthContext';
import {
  useSearchUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../../redux/AdminApi';
const UserDashboard = () => {

    const [searchTerm, setSearchTerm] = useState('');
  const { data: users = [], isLoading, isError } = useSearchUserQuery(searchTerm, {
    skip: !searchTerm, // Skip the query if searchTerm is empty
  });


    const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

    const handleModifyUser = async (userId, newRole) => {
    try {
      await updateUser({ id: userId, role: newRole });
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error getting orders data</div>;

return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Search Users</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by username"
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching users.</p>}
      {!isLoading && !isError && users.length > 0 && (
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="p-2 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleModifyUser(user.id, 'admin')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Make Admin
                </button>
                <button
                  onClick={() => handleModifyUser(user.id, 'user')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Make User
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
