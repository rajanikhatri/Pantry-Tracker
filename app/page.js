'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Container } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Style object for the Modal component
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 500,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  // State to manage inventory data
  const [inventory, setInventory] = useState([])
    // State to manage Modal open/close status
  const [open, setOpen] = useState(false)
  // State to manage input item name
  const [itemName, setItemName] = useState('')
    // State to manage search query
  const [searchQuery, setSearchQuery] = useState('')

  // Function to update the inventory from Firebase Firestore

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  // Function to add an item to the inventory in Firestore
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

   // Function to remove an item from the inventory in Firestore
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  // useEffect hook to update inventory when the component mounts
  useEffect(() => {
    updateInventory()
  }, [])

    // Function to open the Modal
  const handleOpen = () => setOpen(true)
  // Function to close the Modal 
  const handleClose = () => setOpen(false)

    // Function to handle search
  // This function filters the inventory based on the search query
  const handleSearch = () => {
    const filteredInventory = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setInventory(filteredInventory)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{
        width: '100%',
        height: '100vh',  // Adjust the height as needed
        backgroundImage: `url('/images/background.jpeg')`,
        backgroundSize: 'cover',  // Adjust how the image fits the container
        backgroundPosition: 'center',  // Center the image
        backgroundRepeat: 'no-repeat',  // Prevent the image from repeating
        
      }}
    >
      {/* Modal for adding a new item */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="50%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

       {/* Button to open the Modal */}
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      {/* Search bar and button */}
      <Box 
           width="80%"
           height="70vh"
           border="1px solid #333"
           display="flex"
           flexDirection="column"
           gap={2}
           padding={2}    
        > 
        <Box
        width="100%"
        height="auto"
        bgcolor="#ADD8E6"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
        >
          <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" flexGrow={1} spacing={2} overflow={'auto'} color={'#333'}>
          
           {/* TextField for search input */}
           <Stack direction="row" spacing={2} marginBottom={2}>
          <TextField
            id="search-bar"
            label="Search Inventory"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              input: { color: 'white' }, // Changes the text color to white
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Changes the border color to white
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Changes the border color on hover to white
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Changes the border color when focused to white
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Changes the label color to white
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Keeps the label color white when focused
              },
            }}
          />

          {/* Button to trigger search */}

          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>

        </Stack>
          {/* Display inventory items */}

          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              minWidth={'100px'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
           
            
            >
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction={'row'} spacing={1}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

