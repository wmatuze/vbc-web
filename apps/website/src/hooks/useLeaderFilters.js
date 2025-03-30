import { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';

export const useLeaderFilters = (leaders) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get unique departments from leaders
  const departmentList = useMemo(() => {
    return ['all', ...new Set(leaders.filter(l => l.department).map(l => l.department))];
  }, [leaders]);

  // Debounced search handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Filter and sort leaders
  const filteredLeaders = useMemo(() => {
    return leaders
      .filter(leader => {
        const matchesSearch = searchTerm === '' || 
          leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.ministryFocus?.some(focus => focus.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesDepartment = filterDepartment === 'all' || leader.department === filterDepartment;
        
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => {
        if (sortBy === 'order') {
          return sortOrder === 'asc' ? (a.order || 0) - (b.order || 0) : (b.order || 0) - (a.order || 0);
        } else if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return 0;
      });
  }, [leaders, searchTerm, filterDepartment, sortBy, sortOrder]);

  return {
    searchTerm,
    setSearchTerm: debouncedSetSearchTerm,
    filterDepartment,
    setFilterDepartment,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    departmentList,
    filteredLeaders
  };
}; 