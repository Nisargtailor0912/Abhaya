import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import MedicalInfoView from './components/MedicalInfoView.tsx';
import './index.css';
import './firebase';

const searchParams = new URLSearchParams(window.location.search);
const medicalDataRaw = searchParams.get('medicalData');
let medicalData = null;

if (medicalDataRaw) {
  try {
    medicalData = JSON.parse(decodeURIComponent(atob(medicalDataRaw)));
  } catch (e) {
    console.error("Invalid medical data in URL");
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {medicalData ? <MedicalInfoView data={medicalData} /> : <App />}
  </StrictMode>,
);
