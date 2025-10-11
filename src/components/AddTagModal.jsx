import React, { useState } from 'react';
import { api } from '../api';

const AddTagModal = ({ isOpen, onClose, onSuccess }) => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (tagInput.trim()) {
      const parsedTags = tagInput.split(',').map(t => t.trim()).filter(t => t);
      setTags(parsedTags);
    } else {
      setTags([]);
    }
  }, [tagInput]);

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTagInput(newTags.join(', '));
  };

  const handleSave = async () => {
    if (tags.length === 0) {
      setError('Enter at least one tag');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await api.createTagsBatch(tags);
      
      setLoading(false);
      
      if (result.success) {
        setSuccess(`✅ ${result.created} tag(s) added successfully (${result.requested} requested)`);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1000);
      } else {
        setError('❌ Failed to create tags');
      }
    } catch (e) {
      setLoading(false);
      setError(`❌ Failed to create tags: ${e.message}`);
    }
  };

  const handleClose = () => {
    setTagInput('');
    setTags([]);
    setError('');
    setSuccess('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add new tags</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter comma-separated tags:
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="computer-systems, distributed-systems, networking, systems-thinking"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {tags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Preview tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => removeTag(index)}
                    className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 transition-colors"
                  >
                    {tag}
                    <span className="text-lg leading-none">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              Saving tags...
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Tags'}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTagModal;




