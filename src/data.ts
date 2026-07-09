import { Phone, ShieldAlert, MapPin, Volume2, QrCode } from 'lucide-react';

export const quickActions = [
  {
    id: 'fake-call',
    title: 'Fake Call',
    icon: Phone,
    color: 'bg-blue-100 text-blue-600',
    description: 'Simulate an incoming call',
  },
  {
    id: 'alarm',
    title: 'Loud Alarm',
    icon: Volume2,
    color: 'bg-orange-100 text-orange-600',
    description: 'Trigger a loud siren',
  },
  {
    id: 'share-location',
    title: 'Share Location',
    icon: MapPin,
    color: 'bg-green-100 text-green-600',
    description: 'Send live GPS location',
  },
  {
    id: 'medical-qr',
    title: 'Medical QR',
    icon: QrCode,
    color: 'bg-purple-100 text-purple-600',
    description: 'Show medical info',
  }
];

export const mockContacts: { id: string; name: string; phone: string; relation: string; }[] = [];

export const mockHistory: { id: string; type: 'SOS' | 'Alarm' | 'Location Shared'; date: string; location?: string; resolved: boolean; }[] = [];

export const safetyTips = [
  "Always share your live location with a trusted contact when traveling alone.",
  "Trust your instincts; if a situation feels unsafe, leave immediately.",
  "Keep your phone charged and easily accessible.",
  "Avoid isolated or poorly lit areas when walking at night."
];



export const defaultSettings = {
  voiceActivatedSOS: false,
  shakeToTriggerSOS: true,
  offlineSMS: true,
  pushNotifications: true,
  locationTracking: true,
  lowPowerMode: false,
  locationAccuracy: true,
};
export const defaultPersonalInfo = {
  fullName: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  phone: '+1 234 567 8900',
  bloodGroup: 'O+',
  medicalConditions: 'None',
  homeAddress: '123 Safe Street, Cityville',
  emergencyNote: 'Please contact my family immediately.',
};

export const emergencyNumbersIndia = [
  { service: 'Ambulance', number: '102' },
  { service: 'Anti-Poison', number: '1066' },
  { service: 'Child Abuse Hotline', number: '1098' },
  { service: 'COVID-19 Helpline', number: '1075' },
  { service: 'Cyber Crime', number: '1930' },
  { service: 'Disaster Management', number: '108' },
  { service: 'Domestic Abuse', number: '181' },
  { service: 'Earthquake / Flood / Disaster', number: '1092' },
  { service: 'Emergency (National)', number: '112' },
  { service: 'Fire', number: '101' },
  { service: 'Medical Emergency', number: '108' },
  { service: 'Police', number: '100' },
  { service: 'Railway Enquiry', number: '139' },
  { service: 'Road Accident Emergency', number: '1073' },
  { service: 'Senior Citizen Helpline', number: '14567' },
  { service: 'Women Helpline', number: '1091' }
];
