const fs = require('fs');
const file = 'src/components/Map.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update interface
content = content.replace(
  'interface LocationMapProps {',
  'interface LocationMapProps {\n  sosActive?: boolean;'
);

// Update component signature
content = content.replace(
  'export default function LocationMap({ location }: LocationMapProps) {',
  'export default function LocationMap({ location, sosActive }: LocationMapProps) {'
);

// Add useEffect to handle auto route
const useEffectAutoRoute = `
  useEffect(() => {
    if (sosActive && location.latitude && location.longitude && !showSafeRoute) {
      handleToggleRoute();
    } else if (!sosActive && showSafeRoute) {
      handleToggleRoute(); // turn it off if sos is deactivated
    }
  }, [sosActive, location.latitude, location.longitude]);
`;

content = content.replace(
  '  const handleToggleRoute = () => {',
  useEffectAutoRoute + '\n  const handleToggleRoute = () => {'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Map component updated.");
