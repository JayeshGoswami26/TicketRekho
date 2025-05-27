// src/hooks/useManagers.ts

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Urls from '../networking/app_urls';
import { useSelector } from 'react-redux';
import { Manager } from '../types/manager';

export const useManagers = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const abortController = useRef(new AbortController());

  const limit = 10;

  const formatRoleName = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const fetchManagers = async (currentPage: number) => {
    if (!currentUser?.token || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      abortController.current.abort(); // Cancel previous request
      abortController.current = new AbortController();

      const response = await axios.get(
        `${Urls.getManagers}?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          signal: abortController.current.signal,
        },
      );

      const userList = response.data?.data?.userList;
      const pagination = response.data?.data?.pagination;

      if (response.data.status && Array.isArray(userList)) {
        const processedManagers: Manager[] = userList.map((manager: any) => ({
          _id: manager._id,
          name: manager.name || '',
          email: manager.email || '',
          phoneNumber: manager.phoneNumber || '',
          profileImage: `${Urls.Image_url}${manager.profileImage || ''}`,
          role: formatRoleName(manager.role || ''),
          address: manager.address || '',
          state: manager.state || '',
          city: manager.city || '',
          password: manager.password || '',
          active: manager.active ? 'Active' : 'Inactive',
          createdAt: new Date(manager.createdAt),
        }));

        setManagers((prev) =>
          currentPage === 1
            ? processedManagers
            : [...prev, ...processedManagers],
        );
        setTotalPages(pagination.totalPages || 1);
        setHasMore(currentPage < pagination.totalPages);
      } else {
        setError('Invalid response from server');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Fetch Managers Error:', err);
      setError('Failed to fetch managers');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = abortController.current;
    return () => controller.abort();
  }, []);


  useEffect(() => {
    if (currentUser?.token) {
      fetchManagers(page);
    }
  }, [page, currentUser]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { managers, loading, error, loadMore, hasMore, setManagers };
};
