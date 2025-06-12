// src/frontend/src/components/users/UserForm.tsx
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { UserFormData } from '../../services/userService';

// This should ideally come from a shared location or backend definition
const ROLES = ['ADMIN', 'SUPERVISOR', 'TECHNICIAN', 'VISITOR', 'OPERATOR'];

interface UserFormProps {
  onSubmit: SubmitHandler<UserFormData>;
  defaultValues?: Partial<UserFormData>;
  isEditMode?: boolean;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, defaultValues, isEditMode = false, isLoading = false }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UserFormData>({
    defaultValues: defaultValues || { isActive: true, role: 'TECHNICIAN' },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password_label" className="block text-sm font-medium text-gray-700">
          Password {isEditMode ? '(leave blank to keep current password)' : ''}
        </label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: isEditMode ? false : 'Password is required',
            minLength: isEditMode ? undefined : { value: 6, message: 'Password must be at least 6 characters' },
            validate: value => !isEditMode || !value || value.length >= 6 || 'Password must be at least 6 characters if changing'
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input id="firstName" {...register('firstName')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input id="lastName" {...register('lastName')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input id="phone" type="tel" {...register('phone')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <select
              {...field}
              id="role"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          )}
        />
        {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div className="flex items-center">
        <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
                <input
                    id="isActive"
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
            )}
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Create User')}
      </button>
    </form>
  );
};

export default UserForm;
