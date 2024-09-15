import React from 'react';
import AppRouter from './components/Router/AppRouter';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppRouter />
    </LocalizationProvider>
  );
}

export default App;
