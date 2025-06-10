
import html2canvas from 'html2canvas';

export const downloadPhonePreview = async (elementId: string, filename: string = 'phone-preview.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 3, // Increased scale for better quality
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 0,
      removeContainer: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

export const downloadRedditPost = async (elementId: string, filename: string = 'reddit-post.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 0,
      removeContainer: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

export const handleImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
