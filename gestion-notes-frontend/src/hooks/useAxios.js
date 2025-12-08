import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook personnalisé pour gérer les appels API avec état de chargement
 * @param {Function} apiFunc - Fonction du service à appeler
 * @param {boolean} immediate - Exécuter immédiatement ou non
 */
export const useAxios = (apiFunc, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...params);
      setData(response.data || response);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, setData };
};

/**
 * Hook pour gérer la pagination
 */
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Retour à la première page
  };

  const setPaginationData = (paginationInfo) => {
    if (paginationInfo) {
      setTotalPages(paginationInfo.totalPages || 0);
      setTotal(paginationInfo.total || 0);
    }
  };

  return {
    page,
    limit,
    totalPages,
    total,
    handlePageChange,
    handleLimitChange,
    setPaginationData,
  };
};

/**
 * Hook pour gérer les filtres de recherche
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const removeFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    removeFilter,
    setFilters,
  };
};