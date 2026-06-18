import { useState, useEffect, useCallback } from 'react';
import api from '../app/axios';
import { useDebounce } from './useDebounce';

export function useDataTable(endpoint, params = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(params);
  const debouncedSearch = useDebounce(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(endpoint, {
        params: { page, limit: 20, q: debouncedSearch, ...filters },
      });
      setData(res.items || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, debouncedSearch, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, total, page, pages, loading, search, setSearch, filters, setFilters, setPage, refresh: fetchData };
}
