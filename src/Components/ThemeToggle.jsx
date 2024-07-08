import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import { useDispatch, useSelector } from 'react-redux';
import { handleToggleTheme } from '../Store/Reducers/Reducer';
import { motion } from 'framer-motion';

function ThemeToggle({sx}) {
        
    const mode  = useSelector((state) => state.mode);
    const dispatch = useDispatch();

  return (
    <Box component='div' sx={{ borderWidth:'0', backgroundColor:"applicationTheme.secondary", height:"27px", width:"50px", padding:"3px", borderRadius:"30px" ,  cursor:"pointer", ...sx,}} onClick={() =>  dispatch(handleToggleTheme())} > 
          <Box component={'div'} sx={{width:"100%",height:"100%", position:"relative",}}>
                <Box 
                   component={motion.span} 
                   initial={{ opacity: 0, scale: 0.5 , left: mode !== 'dark' ? 'auto' : '0' , right:  mode !== 'dark' ? '0' : 'auto'   }}
                   animate={{ opacity: 1, scale: 1 , left: mode !== 'dark' ? 'auto' : '0' , right:  mode !== 'dark' ? '0' : 'auto' }}
                   sx={{ width:"16px",height:"100%", padding:"10px", borderRadius:"50%",display:"flex",position:"absolute",right:mode !== 'dark' ? '0' : 'auto',left:'auto',top:0, justifyContent:"center",alignItems:"center"}}
                   >
                    { mode === 'light' ? <WbSunnyIcon  sx={{fontSize:"15px",  color:"applicationTheme.primary"}}/>  : <Brightness3Icon sx={{fontSize:"15px",rotate:"145deg", color:"applicationTheme.primary"}}/> }
                </Box>
          </Box>  
    </Box>
  )
}

export default ThemeToggle