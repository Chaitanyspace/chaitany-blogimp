import React, { useState } from 'react';
import AddTagModal from './AddTagModal';

const AddTagTab = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create new tags</h2>
      <p className="text-gray-600 mb-6">
        Use this to add multiple tags at once. Enter comma-separated tags like: computer-systems, distributed-systems, networking. Or use the button in the Add Link tab.
      </p>
      
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Open Add Tags popup
      </button>

      <AddTagModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default AddTagTab;




