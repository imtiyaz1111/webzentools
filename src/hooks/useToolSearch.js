import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { allTools } from '../data/toolsData';

/**
 * Custom hook to handle tool search and filtering logic.
 * Centralizes search state and navigation for consistency across the app.
 */
export const useToolSearch = (initialQuery = '') => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const navigate = useNavigate();

    // Memoized filter logic for performance
    const filteredTools = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];
        
        return allTools.filter(tool =>
            tool.name.toLowerCase().includes(query) ||
            tool.desc.toLowerCase().includes(query) ||
            tool.category.toLowerCase().includes(query)
        ).slice(0, 8); // Limit preview results
    }, [searchQuery]);

    // Handle search submission
    const handleSearchSubmit = useCallback((e) => {
        if (e) e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            navigate(`/tools?q=${encodeURIComponent(query)}`);
            // Optionally clear search after navigation if needed
            // setSearchQuery(''); 
        }
    }, [searchQuery, navigate]);

    // Handle category navigation
    const navigateToCategory = useCallback((categoryId) => {
        navigate(`/tools?category=${categoryId}`);
    }, [navigate]);

    return {
        searchQuery,
        setSearchQuery,
        filteredTools,
        handleSearchSubmit,
        navigateToCategory
    };
};

export default useToolSearch;
