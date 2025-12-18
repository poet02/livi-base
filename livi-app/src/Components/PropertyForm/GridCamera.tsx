import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Camera, X, Check, VideoOff, RotateCcw } from 'lucide-react';
import { useCamera } from '../../context/CameraContext';
import piexif from 'piexifjs';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const CameraContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
`;

const VideoElement = styled.video.withConfig({
  shouldForwardProp: (prop) => !['show', 'mirror'].includes(prop),
})<{ show: boolean; mirror: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.show ? 'block' : 'none'};
  transform: ${props => props.mirror ? 'scaleX(-1)' : 'scaleX(1)'};
`;

const Canvas = styled.canvas`
  display: none;
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Viewfinder = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
`;

const Controls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem;
`;

const CaptureButton = styled.button`
  background: white;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.8);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 32px;
    height: 32px;
    color: #333;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const PreviewContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  display: flex;
  flex-direction: column;
  z-index: 20;
`;

const PreviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
`;

const PreviewControls = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewButton = styled.button<{ variant: 'accept' | 'reject' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'accept' ? `
    background: #2e7d32;
    color: white;

    &:hover {
      background: #1b5e20;
    }
  ` : `
    background: #d32f2f;
    color: white;

    &:hover {
      background: #c62828;
    }
  `}

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 300px;
  border: 1px solid #d32f2f;
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.125rem;
  text-align: center;
`;

const LocationInfo = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: monospace;
  z-index: 20;
`;

interface GridCameraProps {
  onCapture: (file: File, location?: { latitude: number; longitude: number }) => void;
  onClose: () => void;
}

// Helper functions for binary conversion
function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

function binaryStringToArrayBuffer(binary: string): ArrayBuffer {
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export function GridCamera({ onCapture, onClose }: GridCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedBlobRef = useRef<Blob | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const isDev = import.meta.env.DEV;

  const { setActiveStream, stopCamera: globalStopCamera } = useCamera();

  // Initialize camera
  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupCamera();
    };
  }, []);

  // Restart video when returning from preview
  useEffect(() => {
    if (!currentPreview && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.play().catch(error => {
        console.error('Failed to restart video after preview:', error);
      });
    }
  }, [currentPreview, stream]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [currentPreview]);

  const cleanupCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }

    globalStopCamera();

    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null;
      video.load();
    }

    setIsCameraActive(false);
  };

  const setupVideo = (mediaStream: MediaStream) => {
    if (!videoRef.current) return false;

    const video = videoRef.current;
    video.srcObject = mediaStream;

    return new Promise<void>((resolve, reject) => {
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        video.play()
          .then(() => {
            setIsCameraActive(true);
            setIsLoading(false);
            setActiveStream(mediaStream);
            resolve();
          })
          .catch(reject);
      };

      const onError = () => {
        video.removeEventListener('canplay', onCanPlay);
        reject(new Error('Video error'));
      };

      const timeout = setTimeout(() => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onError);
        reject(new Error('Video setup timeout'));
      }, 10000);

      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onError);
    });
  };

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');

      if (!videoRef.current) {
        setTimeout(startCamera, 100);
        return;
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      await setupVideo(mediaStream);

    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setCameraError(`Cannot access camera: ${error.message}`);
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setTimeout(startCamera, 100);
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;

      try {
        context.drawImage(video, 0, 0, width, height);

        // Try to get location when photo is captured
        try {
          const coords = await getCurrentLocation();
          setLocation(coords);
        } catch (error) {
          console.warn('Could not get location on capture:', error);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            capturedBlobRef.current = blob;
            const previewUrl = URL.createObjectURL(blob);
            setCurrentPreview(previewUrl);
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        console.error('Capture error:', error);
      }
    }
  };

  const acceptPhoto = async () => {
    if (!currentPreview || !capturedBlobRef.current) return;

    // Use location if we have it, otherwise try to get it
    let coords = location;
    if (!coords) {
      try {
        coords = await getCurrentLocation();
        setLocation(coords);
      } catch (error) {
        console.warn('Could not get location:', error);
      }
    }

    if (coords) {
      try {
        // Convert blob to array buffer
        const arrayBuffer = await capturedBlobRef.current.arrayBuffer();
        const binary = arrayBufferToBinaryString(arrayBuffer);

        // Create EXIF data with GPS coordinates
        const exifObj = {
          '0th': {},
          'Exif': {},
          'GPS': {
            [piexif.GPSIFD.GPSLatitude]: piexif.GPSHelper.degToDmsRational(coords.latitude),
            [piexif.GPSIFD.GPSLatitudeRef]: coords.latitude >= 0 ? 'N' : 'S',
            [piexif.GPSIFD.GPSLongitude]: piexif.GPSHelper.degToDmsRational(coords.longitude),
            [piexif.GPSIFD.GPSLongitudeRef]: coords.longitude >= 0 ? 'E' : 'W',
          },
          'Interop': {},
          '1st': {},
          'thumbnail': undefined,
        };

        // Insert EXIF data into image
        const exifStr = piexif.dump(exifObj);
        const newBinary = piexif.insert(exifStr, binary);
        const newBlob = new Blob([binaryStringToArrayBuffer(newBinary)], { type: 'image/jpeg' });

        // Convert to File
        const file = new File([newBlob], `property-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        cleanupCamera();
        
        if (currentPreview) {
          URL.revokeObjectURL(currentPreview);
        }

        onCapture(file, coords);
        return;
      } catch (error) {
        console.warn('Could not embed location data:', error);
      }
    }

    // Fallback: create file without location data
    const file = new File([capturedBlobRef.current], `property-photo-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });

    cleanupCamera();
    
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    onCapture(file, coords || undefined);
  };

  const rejectPhoto = () => {
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }
    setCurrentPreview(null);
    setLocation(null);
  };

  const handleClose = () => {
    cleanupCamera();
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }
    onClose();
  };

  const retryCamera = () => {
    setCameraError('');
    startCamera();
  };

  // Show preview if we have a current preview image
  if (currentPreview) {
    return (
      <ModalOverlay>
        <PreviewContainer>
          <PreviewContent>
            <PreviewImage src={currentPreview} alt="Captured preview" />
            {location && (
              <LocationInfo>
                📍 Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
              </LocationInfo>
            )}
          </PreviewContent>
          <PreviewControls>
            <PreviewButton variant="reject" onClick={rejectPhoto}>
              <X />
              Retake
            </PreviewButton>
            <PreviewButton variant="accept" onClick={acceptPhoto}>
              <Check />
              Use Photo
            </PreviewButton>
          </PreviewControls>
        </PreviewContainer>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <Container>
        <Header>
          <CloseButton onClick={handleClose}>
            <X />
          </CloseButton>
          <Title>Take Photo</Title>
        </Header>

      <CameraContainer>
        {isLoading && !cameraError && (
          <LoadingMessage>
            <div>Starting camera...</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Please allow camera permissions
            </div>
          </LoadingMessage>
        )}

        {cameraError && (
          <ErrorMessage>
            <VideoOff size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ marginBottom: '1rem' }}>{cameraError}</div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={retryCamera}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
            </div>
          </ErrorMessage>
        )}

        <VideoElement
          ref={videoRef}
          autoPlay
          playsInline
          muted
          show={isCameraActive && !currentPreview}
          mirror={facingMode === 'user'}
        />

        {isCameraActive && !cameraError && !currentPreview && (
          <>
            <CameraOverlay>
              <Viewfinder />
            </CameraOverlay>

            <Controls>
              <ControlButton onClick={switchCamera}>
                <RotateCcw />
              </ControlButton>

              <CaptureButton onClick={capturePhoto}>
                <Camera />
              </CaptureButton>
            </Controls>
          </>
        )}

        <Canvas ref={canvasRef} />
      </CameraContainer>
    </Container>
    </ModalOverlay>
  );
}

