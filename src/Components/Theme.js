import { createTheme } from "@mui/material"

 
export const lightTheme =  createTheme({
        palette: {
            mode:'light',
            applicationTheme: {
               main: "#124559",
               primary: "#FFFFFF",
               primaryColor_1: "#f2f2f2",
               primaryColor_2: "grey",
               secondary: "#000000",
               secondaryColor_1: "#191919", 
               secondaryColor_2: "#333333",
            },
        },
        typography: {
            fontFamily: ['"Open Sans", "sans-serif"'].join(','),
          
            h1:{
                '@media (max-width:585.98px)': {
                    fontSize:"50px",
                },
            },
            h2:{
                '@media (max-width:585.98px)': {
                    fontSize:"30px",
                },
            },
            h3:{
                '@media (max-width:585.98px)': {
                    fontSize:"25px",
                },
            },
            h4:{
                '@media (max-width:585.98px)': {
                    fontSize:"24px",
                },
            },
            h5:{
                '@media (max-width:585.98px)': {
                    fontSize:"23px",
                },
            },
            h6:{
                '@media (max-width:585.98px)': {
                    fontSize:"20px",
                },
            },
            p:{
                '@media (max-width:585.98px)': {
                    fontSize:"14px",
                },
            },
            

          
          
          
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: ({theme}) => ( {
                        "& .MuiOutlinedInput-root": {
                            color: theme.palette.applicationTheme.secondaryColor_1,
                            fontWeight: "500",
                            borderRadius:"0px",
                            fontSize:"18px",
                            "&.Mui-hover":{
                                borderColor: theme.palette.applicationTheme.secondary,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: theme.palette.applicationTheme.secondary,
                                    borderWidth: "1.5px",
                                },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.applicationTheme.secondary,
                                borderWidth: "1.5px",
                            },
                            "&.Mui-focused": {
                                fontWeight: "500",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: theme.palette.applicationTheme.secondary,
                                    borderWidth: "1.5px",
                                },
                            },
                            '@media (max-width:585.98px)': {
                                fontSize:"15px",
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: theme.palette.applicationTheme.secondary,
                            fontWeight: "500",
                            fontSize:"18px",
                            backgroundColor:theme.palette.applicationTheme.primary,
                            "&.Mui-focused": {
                                color: theme.palette.applicationTheme.secondary,
                                fontSize:"18px",
                                '@media (max-width:585.98px)': {
                                    fontSize:"15px",
                                },
                            },
                            '@media (max-width:585.98px)': {
                                fontSize:"15px",
                            },
                        },  
                    }),
            },  
         },
         MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    textTransform: 'none',
                    borderRadius: '1px',
                    backgroundColor: theme.palette.applicationTheme.secondary,
                    padding:"8px 10px",
                    borderRadius:"30px",
                    fontSize:"15px",
                    color:theme.palette.applicationTheme.primary,
                    '&:hover': {
                        backgroundColor: theme.palette.applicationTheme.secondaryColor_1,
                    },
                    "&:disabled": {
                        backgroundColor: theme.palette.applicationTheme.secondaryColor_1,
                        color:theme.palette.applicationTheme.primaryColor_2,
                        opacity: 0.2
                    }
                    
                }),
            },
        },
        MuiToggleButtonGroup:{
            styleOverrides:{
                 root: ({theme}) => ({
                        backgroundColor: theme.palette.applicationTheme.primaryColor_1,
                        border:"none",
                 })
            }
        },
        MuiToggleButton:{
            styleOverrides:{
                root:({theme}) => ({
                      border:"1px solid lightgrey",
                    color: theme.palette.applicationTheme.primaryColor_2,
                    fontSize:"14px",
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    gap:"2px",
                    "&.Mui-selected":{
                          border:"1px solid lightgrey",
                        backgroundColor:theme.palette.applicationTheme.main,
                        color:theme.palette.applicationTheme.primaryColor_1,
                        opacity:0.7,
                        "&:hover":{
                            backgroundColor:theme.palette.applicationTheme.main,
                            opacity:0.9,
                        }
                        
                    },
                    "&:hover":{
                          border:"1px solid lightgrey",
                        backgroundColor:theme.palette.applicationTheme.primaryColor_1,
                    }
                    
                })
            }
        },
      
        }
})


export const darkTheme = createTheme({
    palette: {
        mode:'dark',
        applicationTheme: {
           main: "#73A5C6",
           primary: "#191919",
           primaryColor_1: "#191919",
           primaryColor_2: "#595959",
           secondary: "#FFFFFF",
           secondaryColor_1: "#f2f2f2", 
           secondaryColor_2: "grey",
        },
    },
    typography: {
        fontFamily: ['"Open Sans", "sans-serif"'].join(','),
        h1:{
            '@media (max-width:585.98px)': {
                fontSize:"50px",
            },
        },
        h2:{
            '@media (max-width:585.98px)': {
                fontSize:"30px",
            },
        },
        h3:{
            '@media (max-width:585.98px)': {
                fontSize:"25px",
            },
        },
        h4:{
            '@media (max-width:585.98px)': {
                fontSize:"24px",
            },
        },
        h5:{
            '@media (max-width:585.98px)': {
                fontSize:"23px",
            },
        },
        h6:{
            '@media (max-width:585.98px)': {
                fontSize:"20px",
            },
        },
        p:{
            '@media (max-width:585.98px)': {
                fontSize:"14px",
            },
        },
        
        
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: ({theme}) => ( {
                    "& .MuiOutlinedInput-root": {
                        color: theme.palette.applicationTheme.secondaryColor_1,
                        fontWeight: "500",
                        borderRadius:"0px",
                        fontSize:"18px",
                        "&.Mui-hover":{
                            borderColor: theme.palette.applicationTheme.secondary,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.applicationTheme.secondary,
                                borderWidth: "1.5px",
                            },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.applicationTheme.secondary,
                            borderWidth: "1.5px",
                        },
                        "&.Mui-focused": {
                            fontWeight: "500",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.applicationTheme.secondary,
                                borderWidth: "1.5px",
                            },
                        },
                        '@media (max-width:585.98px)': {
                            fontSize:"15px",
                        },
                    },
                    "& .MuiInputLabel-outlined": {
                        color: theme.palette.applicationTheme.secondary,
                        fontWeight: "500",
                        fontSize:"18px",
                        backgroundColor:theme.palette.applicationTheme.primary,
                        "&.Mui-focused": {
                            color: theme.palette.applicationTheme.secondary,
                            fontSize:"18px",
                            '@media (max-width:585.98px)': {
                                fontSize:"15px",
                            },
                        },
                        '@media (max-width:585.98px)': {
                            fontSize:"15px",
                        },
                    },  
                }),
        },  
     },
     MuiButton: {
        styleOverrides: {
            root: ({ theme }) => ({
                textTransform: 'none',
                borderRadius: '1px',
                backgroundColor: theme.palette.applicationTheme.secondary,
                padding:"8px 10px",
                borderRadius:"30px",
                fontSize:"15px",
                color:theme.palette.applicationTheme.primary,
                '&:hover': {
                    backgroundColor: theme.palette.applicationTheme.secondaryColor_1,
                },
                "&:disabled": {
                    backgroundColor: theme.palette.applicationTheme.secondaryColor_1,
                    color:theme.palette.applicationTheme.primaryColor_2,
                    opacity: 0.2
                }
                
            }),
        },
    },
    MuiToggleButtonGroup:{
        styleOverrides:{
             root: ({theme}) => ({
                    backgroundColor: theme.palette.applicationTheme.primaryColor_1,
                    border:"none",
             })
        }
    },
    MuiToggleButton:{
        styleOverrides:{
            root:({theme}) => ({
                  border:"1px solid lightgrey",
                color: theme.palette.applicationTheme.secondaryColor_1,
                fontSize:"14px",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                gap:"2px",
                '@media (max-width:585.98px)': {
                    fontSize:"12px",
                },
                "&.Mui-selected":{
                      border:"1px solid lightgrey",
                    backgroundColor:theme.palette.applicationTheme.main,
                    color:theme.palette.applicationTheme.primaryColor_1,
                    opacity:0.7,
                    "&:hover":{
                        backgroundColor:theme.palette.applicationTheme.main,
                        opacity:0.9,
                    }
                    
                },
                "&:hover":{
                      border:"1px solid lightgrey",
                    backgroundColor:theme.palette.applicationTheme.primaryColor_1,
                }
                
            })
        }
    }
    }
})


/* 

sx={{
                                        bgcolor: "applicationTheme.main",
                                        mb: 2,
                                        padding: "15px",
                                        color: "white",
                                        borderRadius: "30px",
                                        fontSize: "15px",
                                        transition: "background-color 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "applicationTheme.primary"
                                        },
                                        "&:disabled": {
                                            backgroundColor: "applicationTheme.main",
                                            opacity: 0.7
                                        }
                                    }}
                                    */
/*  MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        textTransform: 'none',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: theme.palette.applicationTheme.primary,
                            color: theme.palette.applicationTheme.bgColor,
                        },
                        ...(theme.palette.mode === 'dark' && {
                            color: theme.palette.applicationTheme.textColor2,
                        }),
                    }),
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        backgroundColor: theme.palette.applicationTheme.main,
                        ...(theme.palette.mode === 'dark' && {
                            backgroundColor: theme.palette.applicationTheme.bgColor,
                        }),
                    }),
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: => ({
                        color: theme.palette.applicationTheme.textColor,
                        ...(theme.palette.mode === 'dark' && {
                            color: theme.palette.applicationTheme.textColor2,
                        }),
                    }),
                },
            }, */