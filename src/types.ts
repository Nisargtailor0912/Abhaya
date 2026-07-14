export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export interface HistoryEvent {
  id: string;
  type: 'SOS' | 'Alarm' | 'Location Shared' | 'Fake Call';
  date: string;
  location?: string;
  resolved: boolean;
}

export interface UserSettings {
  voiceActivatedSOS: boolean;
  shakeToTriggerSOS: boolean;
  offlineSMS: boolean;
  pushNotifications: boolean;
  locationTracking: boolean;
  lowPowerMode: boolean;
  locationAccuracy: boolean;
  theme?: "light" | "dark" | "system";
  stealthMode?: boolean;
  stealthPIN?: string;
  blurSensitiveInfo?: boolean;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  medicalConditions: string;
  homeAddress: string;
  emergencyNote: string;
}
