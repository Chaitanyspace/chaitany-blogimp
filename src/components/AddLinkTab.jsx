import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { normalizeUrl } from '../utils';
import AddTagModal from './AddTagModal';

const AddLinkTab = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadTags();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data);
    } catch (e) {
      console.error('Failed to load tags:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      const normalizedUrl = normalizeUrl(url);
      await api.createBookmark({
        title: title.trim(),
        url: normalizedUrl,
        description: description.trim() || null,
        tags: selectedTags,
      });
      
      setSuccess('Saved!');
      // Clear form
      setTitle('');
      setUrl('');
      setDescription('');
      setSelectedTags([]);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(`Save failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
    setTagSearch('');
    setShowTagDropdown(false);
  };

  const handleTagSearchChange = (e) => {
    const value = e.target.value;
    setTagSearch(value);
    setShowTagDropdown(value.length > 0);
  };

  const handleTagPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedTags = pastedText.split(',').map(t => t.trim()).filter(t => t);
    
    // Find available tags from the pasted list
    const availableTags = pastedTags.filter(tag => 
      tags.some(availableTag => availableTag.Name.toLowerCase() === tag.toLowerCase())
    );
    
    // Find tags that don't exist
    const unavailableTags = pastedTags.filter(tag => 
      !tags.some(availableTag => availableTag.Name.toLowerCase() === tag.toLowerCase())
    );
    
    // Add available tags to selected tags (avoid duplicates)
    const newSelectedTags = [...new Set([...selectedTags, ...availableTags])];
    setSelectedTags(newSelectedTags);
    
    // Show feedback about which tags were found/not found
    if (availableTags.length > 0) {
      setSuccess(`✅ Added ${availableTags.length} tag(s): ${availableTags.join(', ')}`);
      setTimeout(() => setSuccess(''), 3000);
    }
    
    if (unavailableTags.length > 0) {
      setError(`❌ ${unavailableTags.length} tag(s) not found: ${unavailableTags.join(', ')}`);
      setTimeout(() => setError(''), 5000);
    }
    
    // Clear the search input
    setTagSearch('');
    setShowTagDropdown(false);
  };

  const filteredTags = tags.filter(tag => 
    tag.Name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !selectedTags.includes(tag.Name)
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && filteredTags.length > 0) {
      e.preventDefault();
      handleTagToggle(filteredTags[0].Name);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add a link</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter bookmark title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional description"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags (searchable)
            </label>
            <button
              type="button"
              onClick={() => setShowTagModal(true)}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Tags
            </button>
          </div>
          
          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="border border-gray-300 rounded-lg p-3 mb-3 min-h-[50px]">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className="text-blue-200 hover:text-white text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Search Input */}
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              value={tagSearch}
              onChange={handleTagSearchChange}
              onKeyPress={handleKeyPress}
              onPaste={handleTagPaste}
              onFocus={() => setShowTagDropdown(tagSearch.length > 0)}
              placeholder="Type to search tags or paste comma-separated tags (e.g., 32,28,949)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Dropdown */}
            {showTagDropdown && filteredTags.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.Id}
                    type="button"
                    onClick={() => handleTagToggle(tag.Name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                  >
                    {tag.Name}
                  </button>
                ))}
              </div>
            )}
            
            {/* No results message */}
            {showTagDropdown && tagSearch.length > 0 && filteredTags.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-500">
                No tags found for "{tagSearch}"
              </div>
            )}
          </div>
          
          {/* Available Tags (when not searching) */}
          {!showTagDropdown && tags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Available tags:</p>
              <div className="border border-gray-200 rounded-lg p-3 max-h-[120px] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {tags.filter(tag => !selectedTags.includes(tag.Name)).map((tag) => (
                    <button
                      key={tag.Id}
                      type="button"
                      onClick={() => handleTagToggle(tag.Name)}
                      className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {tag.Name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {tags.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">No tags available. Create some tags first!</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save link'}
        </button>
      </form>

      <AddTagModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        onSuccess={loadTags}
      />
    </div>
  );
};

export default AddLinkTab;

