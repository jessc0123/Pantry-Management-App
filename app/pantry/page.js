'use client'
import {Box, Stack, Typography, Button, Modal, TextField, Accordion, AccordionSummary, AccordionDetails, MenuItem, Select, InputLabel, FormControl} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {firestore} from '../firebase.js'
import {collection, doc, getDocs, query, setDoc, deleteDoc, getDoc} from 'firebase/firestore' 
import { useEffect, useState } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F5EFE7',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 3,
  display: 'flex',
  flexDirection:'column',
};

const categories = [
  "Vegetables", "Fruits", "Dairy", "Spices", 
  "Dry Foods", "Frozen Foods", "Meats/Deli", "Snacks"
]

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemCategory, setItemCategory] = useState('Vegetables') 
  // 'Vegetables' is the default category in modal, but it can be changed to preference 
  // can change on based on preferance, but decided on 'Vegetables' bc its the first category


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

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => { 
      pantryList.push({name: doc.id, ...doc.data() })
    })
    setPantry(pantryList)
  }

  useEffect(() => { 
    updatePantry()
  }, [])

  const addItem = async (item, category) =>{
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity, category: existingCategory} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1, category: existingCategory}) 
    } else {
      await setDoc(docRef, { quantity: 1, category }) 
    }
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity, category} = docSnap.data() 
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1, category})
      }
    }
    await updatePantry()
  }

  // Group pantry items by category
  const groupedPantry = categories.reduce((acc, cat) => {
    acc[cat] = pantry.filter(item => item.category === cat)
    return acc
  }, {})

 
  

  return (
    <Box
      /* Attributes of main box components */
      width="100vw"
      height="100vh"
      display={'flex'} 
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
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

      {/* Modal */}
      <Modal fontFamily={"serif"} open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" fontFamily={"serif"}>Add Item</Typography>
          <TextField 
            label="Item" 
            fullWidth
            
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              label="Category"
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Button apart of modal */}
          <Button 
            variant="outlined" 
            sx={{  backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", color:"#3E5879"}} 
            onClick={() => {
              addItem(itemName, itemCategory)
              setItemName('')
              setItemCategory('Vegetables')
              handleClose()
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      
      



      <Box width="900px">
        <Box
          width="100%"
          height="100px"
        >
          <Typography variant={'h2'} color={"#F5EFE7"} textAlign={'center'} fontFamily={'serif'}>
            Pantry Items
          </Typography>
        </Box>
        
        {/* <Button  variant="contained" sx={{ backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", color:"#3E5879"}} onClick={handleOpen}>Add Item</Button> */}

        <Box width="100%" display="flex" justifyContent="center" my={2}>
          <Button  
            variant="contained" 
            sx={{ 
              backgroundColor: "#F5EFE7", 
              "&:hover": { backgroundColor: "#D8C4B6" }, 
              fontFamily:"serif", 
              color:"#3E5879",
              outlineColor:"#3E5879"
            }} 
    onClick={handleOpen}
  >
    Add Item
  </Button>
</Box>


        {/* Accordions per category */}
        <Stack width="100%" spacing={2} overflow={'auto'} maxHeight="500px" p={2} 
        >
          {categories.map(cat => (
            <Accordion key={cat} 
            sx={{
              backgroundColor: '#F5EFE7', // header
              color: '#3E5879',
              //'&:hover': { backgroundColor: "#D8C4B6"}
            }}
            
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography 
                fontFamily={"serif"}
                 variant="h5"
                 
                
                >{cat}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {groupedPantry[cat].length > 0 ? (
                  groupedPantry[cat].map(({name, quantity}) => (
                    <Box
                      key={name}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{  backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", fontWeight:"bold", color:"#3E5879"}} 
                      color="#F5EFE7"
                      p={2}
                      mb={1}
                      fontFamily={"serif"}
                    >
                      <Typography fontFamily={"serif"}  variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                      <Typography fontFamily={"serif"} variant="h6">Qty: {quantity}</Typography>
                      <Button sx={{  backgroundColor: "#F5EFE7", "&:hover": { backgroundColor: "#D8C4B6" }, fontFamily:"serif", color:"#3E5879"}} variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No items in this category</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        backgroundColor="#213555" 
        color="#D8C4B6"
        p={2} 
        textAlign="center"
        sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000}}
      >
        <Typography variant="body2" fontFamily="serif">
          © 2025 My Pantry App
        </Typography>
      </Box>
    </Box>
  )
}
