import React, { useState, useEffect } from 'react';
import { api } from '../api';
import BookmarkCard from './BookmarkCard';

const SearchTab = () => {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [tags, setTags] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [lastSignature, setLastSignature] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [search, filterTag]);

  // Reset pagination when filters change
  useEffect(() => {
    const signature = `${search}|${filterTag}`;
    if (signature !== lastSignature) {
      setPage(1);
      setLastSignature(signature);
    }
  }, [search, filterTag]);

  const loadTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data);
    } catch (e) {
      console.error('Failed to load tags:', e);
    }
  };

  const loadBookmarks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (filterTag) params.tag = filterTag;
      
      const data = await api.getBookmarks(params);
      setBookmarks(data);
    } catch (e) {
      setError(`Load failed: ${e.message}`);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadBookmarks();
  };

  const handleClear = () => {
    setSearch('');
    setFilterTag('');
    setPage(1);
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(bookmarks.length / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedBookmarks = bookmarks.slice(start, end);

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title/description or tags (OR logic)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Filter by tag (optional)</option>
              {tags.map((tag) => (
                <option key={tag.Id} value={tag.Name}>
                  {tag.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleClear}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="border-t border-gray-200 my-5"></div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!loading && !error && paginatedBookmarks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bookmarks found. Try a different search or add some bookmarks!
        </div>
      )}

      {!loading && paginatedBookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.Id} bookmark={bookmark} />
      ))}

      {/* Pagination */}
      {bookmarks.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            « Prev
          </button>
          <div className="text-gray-600">
            Page {currentPage} of {totalPages} · {bookmarks.length} item(s)
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next »
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTab;


