const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPortal.tsx', 'utf8');

const mapUpdaterOld = `function MapUpdater({ center, trigger }: { center: { lat: number; lng: number }, trigger?: number }) {
  const map = useMap();

  React.useEffect(() => {
    if (map && center.lat && center.lng) {
      map.panTo(center);
      map.setZoom(14);
    }
  }, [map, center, trigger]);

  return null;
}`;

const mapUpdaterNew = `function MapUpdater({ center, trigger }: { center: { lat: number; lng: number }, trigger?: number }) {
  const map = useMap();
  const [initialCentered, setInitialCentered] = React.useState(false);

  React.useEffect(() => {
    if (map && center.lat && center.lng && trigger && trigger > 0) {
      map.panTo(center);
      map.setZoom(14);
    }
  }, [map, trigger]);
  
  React.useEffect(() => {
    if (map && center.lat && center.lng && !initialCentered) {
      map.panTo(center);
      map.setZoom(14);
      setInitialCentered(true);
    }
  }, [map, center.lat, center.lng, initialCentered]);

  return null;
}`;

content = content.replace(mapUpdaterOld, mapUpdaterNew);

const safeRouteOld = `function SafeRouteDirections({
  origin,
  destination,
}: {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = React.useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer>();

  React.useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ 
      map, 
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  React.useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (!origin || !destination) {
      directionsRenderer.setDirections({ routes: [] } as any);
      return;
    }

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then(response => {
        directionsRenderer.setDirections(response);
      })
      .catch(e => {
        console.error("Directions request failed", e);
      });
      
    return () => {
      directionsRenderer.setDirections({ routes: [] } as any);
    };
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}`;

const safeRouteNew = `function SafeRouteDirections({
  origin,
  destination,
}: {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = React.useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer>();

  React.useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ 
      map, 
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  React.useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    if (!origin || !destination) {
      directionsRenderer.setDirections({ routes: [] } as any);
      return;
    }

    directionsService
      .route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then(response => {
        directionsRenderer.setDirections(response);
      })
      .catch(e => {
        console.error("Directions request failed", e);
      });
      
  }, [directionsService, directionsRenderer, origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  return null;
}`;

content = content.replace(safeRouteOld, safeRouteNew);

fs.writeFileSync('src/components/AdminPortal.tsx', content);
