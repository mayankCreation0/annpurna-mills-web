import './App.css';
import AllRoutes from './Routes/Routes';
import { ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import { lightTheme , darkTheme } from './Components/Theme';
import { useSelector } from 'react-redux';

function App() {

  const mode  = useSelector((state) => state.mode);

  return (
   
      <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme }>
           <AllRoutes/>
      </ThemeProvider>
   
  );
}

export default App;





 // const defaultTheme = createTheme({ palette: { mode } });

  /* const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }; */
  //  const [showCustomTheme, setShowCustomTheme] = React.useState(true); */

  