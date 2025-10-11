import React, { useState } from 'react';
import { api } from '../api';

const AddTagModal = ({ isOpen, onClose, onSuccess }) => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const tag of tags) {
      try {
        await api.createTag(tag);
        successCount++;
      } catch (e) {
        errorCount++;
        errors.push(`${tag}: ${e.message}`);
      }
    }

    if (successCount > 0) {
      setSuccess(`✅ ${successCount} tag(s) added successfully`);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    }
    
    if (errorCount > 0) {
      setError(`❌ ${errorCount} tag(s) failed:\n${errors.join('\n')}`);
    }
  };

  const handleClose = () => {
    setTagInput('');
    setTags([]);
    setError('');
    setSuccess('');
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

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Tags
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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




