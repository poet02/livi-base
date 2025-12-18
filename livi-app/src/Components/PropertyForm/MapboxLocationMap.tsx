import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.base};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border.light};
  margin-top: ${props => props.theme.spacing.md};
`;

interface MapboxLocationMapProps {
  latitude?: number;
  longitude?: number;
  accessToken: string;
  address?: string;
  onMarkerDrag?: (lng: number, lat: number) => void;
}

export function MapboxLocationMap({
  latitude,
  longitude,
  accessToken,
  address,
  onMarkerDrag,
}: MapboxLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !accessToken) return;

    // Initialize map
    if (!mapRef.current) {
      mapboxgl.accessToken = accessToken;
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: longitude && latitude ? [longitude, latitude] : [28.0473, -26.2041], // Default to Johannesburg
        zoom: longitude && latitude ? 15 : 10,
      });

      // Add navigation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Update marker when coordinates change
    if (longitude && latitude) {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\' fill=\'%23ef4444\'%3E%3Cpath d=\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\'/%3E%3C/svg%3E")';
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'grab';

      markerRef.current = new mapboxgl.Marker({ 
        element: el,
        draggable: true 
      })
        .setLngLat([longitude, latitude])
        .setPopup(
          address
            ? new mapboxgl.Popup({ offset: 25 }).setText(address)
            : undefined
        )
        .addTo(mapRef.current);

      // Add drag event listeners
      if (onMarkerDrag) {
        markerRef.current.on('dragstart', () => {
          el.style.cursor = 'grabbing';
        });
        
        markerRef.current.on('dragend', () => {
          el.style.cursor = 'grab';
          const lngLat = markerRef.current!.getLngLat();
          onMarkerDrag(lngLat.lng, lngLat.lat);
        });
      }

      // Center map on marker
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 1000,
      });
    }

    // Update popup when address changes (without recreating marker)
    if (markerRef.current && address && longitude && latitude) {
      const popup = markerRef.current.getPopup();
      if (popup) {
        popup.setText(address);
      } else {
        markerRef.current.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(address)
        );
      }
    }

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [latitude, longitude, accessToken, address]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (!latitude || !longitude) {
    return (
      <MapContainer>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '14px'
        }}>
          Select a location to see it on the map
        </div>
      </MapContainer>
    );
  }

  return <MapContainer ref={mapContainerRef} />;
}

