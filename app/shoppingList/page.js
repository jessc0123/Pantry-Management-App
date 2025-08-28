'use client'

import {useState, useEffect} from 'react';
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/Delete";
import {TextField, Box, Typography} from '@mui/material';
import {firestore} from '../firebase.js'
import { collection, addDoc, getDocs, deleteDoc, doc} from "firebase/firestore";

export default function CheckboxList() {
  const [items, setItems] = useState([]);

  const [checked, setChecked] =useState([]);

  const [newItem, setNewItem] = useState("");


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

  const updateGroceryList = async () => {
      //Specifies that we're reading from the collection named 'Pantry' in firestore
      //query just prepares the query
      const snapshot = await getDocs(collection(firestore, 'groceryList'))
      const grocerList = snapshot.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
      }));
      setItems(grocerList);

    }
  
    useEffect(() => { 
      updateGroceryList()
    }, [])

    
  
  
  // Toggle check/uncheck
  const handleToggle = (id) => () => {
    setChecked((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // Add new item
  const handleAdd = async () => {
    if (!newItem.trim()) return;
    const formattedItem = newItem.charAt(0).toUpperCase() + newItem.slice(1);

    await addDoc(collection(firestore, 'groceryList'), { 
      name: formattedItem, 
    });
    setNewItem("");
    updateGroceryList();
  };



  const handleRemove = async (id) => {
    await deleteDoc(doc(firestore, 'groceryList', id));
    updateGroceryList();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      overflow= 'auto'
      backgroundColor="#3E5879"
      
    >
    {/* Header */}
      <Box 
        component="header" 
        backgroundColor="#213555" 
        p={1} 
        flexDirection="row"
        display="flex"
        justifyContent="space-between" 
        alignItems="center"   
        sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}
    
      >
        <Typography variant="subtitle1" textAlign="left" color="#D8C4B6">{date}</Typography>
        <Typography variant="subtitle2" textAlign="right" color="#D8C4B6">{location}</Typography>
      </Box>

    <Box
        
    >
        <Typography fontFamily="serif" height="100px" variant="h2" textAlign="center" color="#F5EFE7"> Grocery List</Typography>
    </Box>


      {/* Input to add items */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          size="small"
          label="New item"
          sx={{backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", color:"#3E5879"}}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button variant="contained" sx={{backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", color:"#3E5879"}} onClick={handleAdd}>
          Add
        </Button>
      </Box>

      {/* Checklist */}
      <List sx={{ width: '100%', maxWidth: 500, height: 500, bgcolor: "#3E5879", overflow: 'auto'}}>
        {items.map((value, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem
              key={index}
              sx={{bgcolor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif"}}
              
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemove(value.id)}> <DeleteIcon /></IconButton>
              }
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox edge="start" checked={checked.includes(value)} tabIndex={-1}  disableRipple inputProps={{ 'aria-labelledby': labelId }}/>
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.name} typography={{fontFamily:"serif"}}sx={{ textDecoration: checked.includes(value) ? "line-through" : "none" }}/>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

        {/* Footer */}
      <Box 
        component="footer" 
        backgroundColor="#213555" 
        color="#D8C4B6"

        p={2} 
        textAlign="center"
        sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000}}
      >
        <Typography variant="body2" fontFamily="serif" >© 2025 Pantry Managament App</Typography>
      </Box>


    </Box>
  );
}
