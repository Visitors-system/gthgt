import React from 'react';
import { useQuery } from 'react-query';
import { fetchUsers, User } from '../services/userService';
import UserList from '../components/users/UserList'; // Corrected path

const UsersPage: React.FC = () => {
  const { data: users, error, isLoading } = useQuery<User[], Error>('users', fetchUsers);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
      <UserList users={users || []} isLoading={isLoading} error={error} />
    </div>
  );
};

export default UsersPage;
