const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.VITE_API_URL}/${cleanPath}`;
};

export default getImageUrl;
