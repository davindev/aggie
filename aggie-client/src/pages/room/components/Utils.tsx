import React from 'react';
import { toast } from 'react-toastify';

interface Props {
  roomId?: string;
  canvasDataURL?: string;
}

export default function Utils({ roomId, canvasDataURL }: Props) {
  const handleCopyURL = () => {
    const URL = window.location.href;
    window.navigator.clipboard.writeText(URL);

    toast.success('URL이 복사되었습니다.');
  };

  const handleDownloadImage = () => {
    if (canvasDataURL) {
      const link = document.createElement('a');
      link.download = `canvas_${roomId}.png`;
      link.href = canvasDataURL;
      link.click();

      toast.success('이미지가 저장되었습니다.');
    }
  };

  return (
    <div
      className="flex gap-x-10 absolute top-10 left-1/2 px-6 py-6 text-4xl"
      style={{ transform: 'translate(-50%, 0)' }}
    >
      <button
        type="button"
        onClick={handleCopyURL}
      >
        🔗
      </button>
      <button
        type="button"
        onClick={handleDownloadImage}
      >
        📥
      </button>
    </div>
  );
}
