// URL normalizer (keeps pasted links as-is; adds http:// if no scheme)
export const normalizeUrl = (raw) => {
  const s = (raw || '').trim();
  if (!s) return s;
  if (!s.includes('://') && !s.startsWith('mailto:') && !s.startsWith('ftp:') && !s.startsWith('file:')) {
    return `http://${s}`;
  }
  return s;
};

// Format date
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString.replace('Z', ''));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString || '';
  }
};




