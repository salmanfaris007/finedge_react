import './App.css';
import { Grid, TextField, Container, Divider,Snackbar, Card, CardHeader, Avatar, IconButton, CardContent, Typography, CardActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button'

import {Delete, Edit} from '@material-ui/icons';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


function App() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState(0);
  const [isAdding, setIsAdding] = useState(true);
  useEffect(() => {
    /**Get Data */
    getProducts();
  },[])

  /**Get Data From Server */
  function getProducts() {
    setItems([]);
    setIsAdding(true);
    setProductName('') ;
    fetch('http://localhost:8081/listUsers').then(res => res.json()).then(res=>{
         var rows = [];
         if(res.length > 0){
          res.forEach(element => {
            rows.push({id: element._id, name: element.name, edit: null, delete: null})
           });
           setItems(rows);
         }
         setProductId(rows.length+1);
     }).catch(e=> console.log('getProducts - error',e));
  }

  /**Add Product */
  async function addProduct(){
   if(isAdding){//Add New Product
    const reqBody={id: productId, name: productName};
    await fetch('http://localhost:8081/addProduct', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(reqBody)
     }).then(res => res.json()).then(res=>{
      if(res.status==500){
        alert(res.message)
      }
      getProducts();
      console.log('addProduct', res);
     }).catch(e=> console.log('addProduct - error',e));
   }else{//Update Product
    const reqBody={id: productId, name: productName};
    await fetch('http://localhost:8081/update', {
       method: 'PUT',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(reqBody)
     }).then(res => res.json()).then(res=>{
      getProducts();
      setProductName('') ;
      console.log('updated', res);
     }).catch(e=> console.log('updated - error',e));
   }
  }

  /**Delete Product */
  function deletProduct(id){
    if (window.confirm("Do you really want to delete?")) {
      fetch(`http://localhost:8081/delete/${id}`, {
        method: 'DELETE'
      }).then(res => res.json()).then(res=>{
        getProducts();
        console.log('deleted success');
      }).catch(e=> console.log('edeletProduct error',e));
    }
   
  }

/**Update */
function editProduct(value){
setProductId(value.id);
setProductName(value.name);
setIsAdding(false);
}

  return (
    <div className="App" >
     <Container fixed maxWidth="lg">
        <Grid container spacing={1}>
            <Grid item xs={12}>
             <br/>
            <Card sx={{ maxWidth: 345 }}>
              <CardHeader
                title="Add Product"
                subheader=""
              />
            <Divider variant='fullWidth'></Divider>

              <CardContent>
                <TextField
                  id="standard-multiline-flexible"
                  value={productId}
                  placeholder="Product Id"
                  disabled/>
                  <br/>
                <TextField
                  id="standard-multiline-flexible"
                  value={productName}
                  placeholder="Product Name"
                  onChange={(event)=> setProductName(event.target.value)}/>
              </CardContent>
              <CardActions style={{float:'right'}}>
              <Button variant="contained" color="primary" onClick={()=> addProduct()}> {isAdding ? 'Save' : 'Update'}</Button>
              <Button variant="contained" color="secondary" onClick={()=> getProducts()}> Cancel</Button>
              <Button variant="contained" color="default" > Refresh</Button>
              </CardActions>
            </Card>
            
           
            </Grid>

            <Divider variant='fullWidth'></Divider>
            
            <Grid item xs={12}>
            
            {items.length > 0 ? <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="left">NAME</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="delete" onClick={()=> deletProduct(row.id)}>
                          <Delete color='secondary' />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="edit" onClick={()=> editProduct(row)}>
                          <Edit color='primary'/>
                      </IconButton>  
                    </TableCell>
                  </TableRow>
                ))}
                
              </TableBody>
            </Table>
            </TableContainer>
            : <span>No data !</span>}
              
            </Grid>
        </Grid>
     </Container>

    </div>
  );
}

export default App;
