'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import {Box, Stack, Typography, Button} from '@mui/material'


export default function HomePage() {
    
    //date: peice of state
    //setDate: function we call to update our state (date)
    //useState: used for storing the data 
    const[date, setDate] = useState("")
    const [location, setLocation] = useState("Fetching location...");

    useEffect(() => {
       // Getting and formatting current day
        const today = new Date();
        const options = { year: "numeric", month: "long", day: "numeric" };
        setDate(today.toLocaleDateString(undefined, options));

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
              },
              (error) => {
                console.error(error);
                setLocation("Location unavailable");
              }
            );
          } else {
            setLocation("Geolocation not supported");
          }



      }, []); 
      // [] --> run only once, when page loads
    
    return (
        <Box 
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      {/* Header */}
      <Box 
        component="header" 
        backgroundColor="#213555" 
        
        p={2} 
        flexDirection="row"
        display="flex"
        justifyContent="space-between" // pushes items to opposite ends
        alignItems="center"   
       

      >
        <Typography variant="subtitle1" textAlign="left" color="#D8C4B6">{date}</Typography>
        <Typography variant="subtitle2" textAlign="right" color="#D8C4B6">{location}</Typography>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        flexGrow={1} 
        display="flex" 
        flexDirection="column" 
        justifyContent="center"
        alignItems="center" 
        gap={2}
        backgroundColor="#3E5879"
      >
        <Typography fontFamily="serif" height="100px" variant="h2" textAlign="center" color="#F5EFE7">Jessica's Pantry</Typography>
        <Typography fontFamily="serif" height="50px" variant="subtitle1" textAlign="center" color="#D8C4B6">Reduce waste, save money.</Typography>

        <Stack direction="column" spacing={4} sx={{ width: "60", height: "250px"}} >
          
          
          <Button rel="pantry" href= "./pantry" variant="contained" sx={{ flexGrow: 1, fontSize: "20px",  backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", color:"#3E5879"}}> Pantry </Button>
          
          
          <Button rel="shoppingList" href= "./shoppingList" variant="contained" sx={{ flexGrow: 1, fontSize: "20px",  backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" },  fontFamily:"serif", color:"#3E5879" }} >Grocery List</Button>

          <Button rel="recipes" href= "./recipes" variant="contained" sx={{ flexGrow: 1, fontSize: "20px",  backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" },  fontFamily:"serif", color:"#3E5879" }} >Recipes of the Day</Button>


        </Stack>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        backgroundColor="#213555" 
        color="#D8C4B6"
        p={2} 
        textAlign="center"
      >
        <Typography variant="body2"> © 2025 Pantry Management App</Typography>
      </Box>
    </Box>
  );


  }

