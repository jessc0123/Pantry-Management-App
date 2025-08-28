'use client'

import { useEffect, useState } from 'react'
import { firestore } from '../firebase.js'
import { collection, getDocs, query } from 'firebase/firestore'
import { Box, Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function RecipesPage() {
  const [pantry, setPantry] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  // getting Pantry item info from our 'pantry' collection in firestore
  const getPantryInfo = async () => {
    const snapshot = await getDocs(collection(firestore, 'pantry'))
    
    const pantryList = []

    snapshot.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() })
    })

    setPantry(pantryList)
  }

  useEffect(() => {
    getPantryInfo()
  }, [])

  //getting ai generated recipes from API
  const getRecipes = async () => {
    if (pantry.length === 0) return
    setLoading(true)

    try {
      const pantryItems = pantry.map(item => item.name)

      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pantryItems })
      })

      const data = await res.json()
      const text = data.text
      const generatedRecipes = JSON.parse(text)


      
    //breaking down generated recipe info
    // could add more categories later on 
    const parsedRecipes = [
      { meal: 'Breakfast', ...generatedRecipes.breakfast },
      { meal: 'Lunch', ...generatedRecipes.lunch },
      { meal: 'Dinner', ...generatedRecipes.dinner },
    ]

      setRecipes(parsedRecipes)
    } catch (err) {
      console.log("couldn't get parsed recipes")
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRecipes()
  }, [pantry])

  return (
    <Box 
    p={3}
    minHeight="100vh"  
    backgroundColor="#3E5879"
    color="#F5EFE7"
    fontFamily={"serif"}
    >
      {/* next implentation goal: add Header and Footer

          previous complications: struggled to get header and footer to be dimensions that 
                                  were identical to the header's and footer's of other pages
          
          Notes to self: review CSS aspects that could be included in 'sx={{}}'

      */}
      <Typography fontFamily={"serif"} variant="h3" mb={3} textAlign="center" > Daily Meal Suggestion Recipes</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5} fontFamily={"serif"}>
          <Typography textAlign="center" fontFamily={"serif"}> Great suggestions on the way...</Typography>
        </Box>
      ) : recipes.length === 0 ? (
        <Typography textAlign="center" fontFamily={"serif"}> No meal recommendations available...add items to your pantry!</Typography>
      ) : (
        <Stack spacing={2}>
          {recipes.map((recipe) => (
            <Accordion key={recipe.meal} fontFamily={"serif"}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontFamily={"serif"} variant="h5">{`${recipe.meal}: ${recipe.name}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Info shown inside category drop down in accordion */}
                <Typography fontFamily={"serif"}> <strong>Calories (per serving):</strong> {recipe.calories} kcal</Typography>
                <Typography fontFamily={"serif"}> <strong>Preparation Time:</strong> {recipe['preparation time']}</Typography>
                <Typography fontFamily={"serif"}> <strong>Cooking Time:</strong> {recipe['cooking time']}</Typography>
                <Typography fontFamily={"serif"}> <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}
    </Box>
)}
