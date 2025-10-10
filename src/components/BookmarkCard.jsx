import React from 'react';
import { formatDate } from '../utils';

const BookmarkCard = ({ bookmark }) => {
  const { Title, Url, Description, CreatedAt, Tags } = bookmark;
  
  const tags = Tags ? Tags.split(',').filter(t => t.trim()) : [];
  const dateStr = formatDate(CreatedAt);

  return (
    <div className="border border-gray-200 rounded-2xl p-5 mb-5 bg-white shadow-sm hover:shadow-lg transition-all duration-150 hover:-translate-y-0.5">
      <div className="mb-2">
        <a
          href={Url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 font-bold text-lg hover:text-blue-800 no-underline"
        >
          {Title}
        </a>
      </div>
      
      {Description && (
        <div className="text-gray-600 mt-1.5 text-sm">
          {Description}
        </div>
      )}
      
      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1.5">
        <span className="text-base">📅</span>
        <span>{dateStr}</span>
      </div>
      
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full text-xs"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;


