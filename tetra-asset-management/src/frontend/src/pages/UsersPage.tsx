// src/frontend/src/pages/UsersPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUsers, User, createUser, updateUser, deleteUser, UserFormData } from '../services/userService';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import toast from 'react-hot-toast'; // Import toast

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users, error: queryError, isLoading: queryIsLoading } = useQuery<User[], Error>('users', fetchUsers, {
    onError: (err) => {
      toast.error(`Failed to fetch users: ${err.message}`);
    }
  });

  const mutationOptions = {
    onSuccess: (data: any, variables: any, context: any) => { // variables and context might differ based on mutation
      queryClient.invalidateQueries('users');
      setShowFormModal(false);
      setEditingUser(null);
      // Determine action for toast message
      let actionMessage = 'Operation successful!';
      if (context?.action === 'create') actionMessage = 'User created successfully!';
      if (context?.action === 'update') actionMessage = 'User updated successfully!';
      // For delete, the success message is handled in its specific mutation options
      if (context?.action !== 'delete') toast.success(actionMessage);
    },
    onError: (err: Error, variables: any, context: any) => {
      toast.error(`Operation failed: ${err.message}`);
      console.error("Mutation error:", err, "Variables:", variables, "Context:", context);
    },
  };

  const createUserMutation = useMutation(createUser, {
    ...mutationOptions,
    onSuccess: (data, variables, context) => mutationOptions.onSuccess(data,variables, {...context, action: 'create'})
  });

  const updateUserMutation = useMutation(
    (data: UserFormData) => {
      if (!editingUser?.id) throw new Error("User ID is missing for update.");
      const { password, ...rest } = data;
      // Send password only if it's not empty and has a minimum length (already handled by form validation)
      // The main goal here is to avoid sending an empty password string if user didn't intend to change it
      const payload = (password && password.trim().length > 0) ? data : rest;
      return updateUser(editingUser.id, payload);
    },
    {
      ...mutationOptions,
      onSuccess: (data,variables,context) => mutationOptions.onSuccess(data,variables, {...context, action: 'update'})
    }
  );

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: (data) => { // data here is { message: string, user: User }
      queryClient.invalidateQueries('users');
      toast.success(data.message || 'User deleted successfully!');
    },
    onError: (err: Error) => {
      toast.error(`Deletion failed: ${err.message}`);
      console.error("Deletion error:", err);
    }
  });

  const handleFormSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUserMutation.mutate(data);
    } else {
      createUserMutation.mutate(data);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const openCreateForm = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const isEditMode = !!editingUser;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={openCreateForm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create User
        </button>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-1 border w-full max-w-2xl shadow-lg rounded-md bg-transparent">
            <div className="bg-white p-2 rounded-lg">
                <div className="flex justify-between items-center pb-3 p-3 border-b">
                    <p className="text-xl font-semibold">{isEditMode ? 'Edit User' : 'Create New User'}</p>
                    <button
                        onClick={() => { setShowFormModal(false); setEditingUser(null); }}
                        className="text-gray-600 hover:text-gray-800 text-2xl leading-none p-1"
                    >&times;</button>
                </div>
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-4"> {/* Scrollable form area with padding */}
                  <UserForm
                      onSubmit={handleFormSubmit}
                      defaultValues={editingUser ? {
                          ...editingUser,
                          password: '',
                      } : { isActive: true, role: 'TECHNICIAN', username: '', email: '' }}
                      isEditMode={isEditMode}
                      isLoading={createUserMutation.isLoading || updateUserMutation.isLoading}
                  />
                </div>
            </div>
          </div>
        </div>
      )}

      <UserList
        users={users || []}
        isLoading={queryIsLoading}
        error={queryError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UsersPage;
