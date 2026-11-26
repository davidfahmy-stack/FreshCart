'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MapPin, Plus, Trash2, Phone, Home, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { addressApi, AddressInput } from '@/services/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export default function AddressesPage() {
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Cairo');

  const addressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.getAddresses(),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressInput) => addressApi.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully!');
      setShowAddModal(false);
      setName('');
      setDetails('');
      setPhone('');
      setCity('Cairo');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, 'Failed to add address'));
    },
  });

  const removeAddressMutation = useMutation({
    mutationFn: (id: string) => addressApi.removeAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address removed');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, 'Failed to remove address'));
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!egyptPhoneRegex.test(phone.trim())) {
      toast.error('Please enter a valid Egyptian phone number (e.g. 01012345678)');
      return;
    }
    addAddressMutation.mutate({ name: name.trim(), details: details.trim(), phone: phone.trim(), city: city.trim() });
  };

  const addresses = addressesQuery.data?.data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/profile"
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Saved Addresses
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your delivery destinations for quick and easy checkout.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-xs py-2.5 px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {addressesQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-40 rounded-2xl" />
          <Skeleton className="w-full h-40 rounded-2xl" />
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-14 h-14 text-gray-400" />}
          title="No Saved Addresses"
          description="You haven't saved any delivery addresses yet. Add an address now to speed up your checkout."
          actionLabel="Add Address"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Home className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{addr.name}</h3>
                  </div>
                  <button
                    onClick={() => removeAddressMutation.mutate(addr._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                  {addr.details}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                  <span className="font-semibold text-gray-700">{addr.city}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{addr.phone}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add New Address</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address Label (e.g. Home, Office)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Home"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control w-full text-sm bg-white"
                >
                  <option value="Cairo">Cairo</option>
                  <option value="Giza">Giza</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Mansoura">Mansoura</option>
                  <option value="Tanta">Tanta</option>
                  <option value="Assiut">Assiut</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street & Building Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="12 El-Tahrir Street, Building 4, Apt 8"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Phone (Egypt)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control w-full text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 px-5 shadow-xs"
                >
                  {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
