// utils/socialShare.js
export const shareOnWhatsApp = (url) => {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://wa.me/?text=${encodedUrl}`, '_blank');
  };
  
  export const shareOnLinkedIn = (url) => {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };
  
  export const shareOnFacebook = (url) => {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };
  
  export const shareOnTwitter = (url) => {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank');
  };