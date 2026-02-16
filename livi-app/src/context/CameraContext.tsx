/* eslint-disable react-refresh/only-export-components */
// context/CameraContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface CameraContextType {
  activeStream: MediaStream | null;
  isCameraActive: boolean;
  setActiveStream: (stream: MediaStream | null) => void;
  stopCamera: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
    streamRef.current = null;
    setActiveStream(null);
    setIsCameraActive(false);
  }, []);

  const setStream = useCallback((stream: MediaStream | null) => {
    streamRef.current = stream;
    setActiveStream(stream);
    setIsCameraActive(!!stream);
  }, []);

  // Auto-stop camera when component unmounts (safety)
  useEffect(() => {
    return () => {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
    };
  }, []);

  const value = {
    activeStream,
    isCameraActive,
    setActiveStream: setStream,
    stopCamera,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}