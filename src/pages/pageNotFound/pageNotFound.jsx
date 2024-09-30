import React from 'react';
import { Button } from '@mui/material';


const PageNotFound = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", fontWeight: "bold", marginTop: "23rem" }}>Page Not Found</h1>
      <div className="d-flex justify-content-center">
        <Button variant="outlined">
        <a href="https://www.bdotsoftware.com" style={{textDecoration: 'none', color: "inherit"}}>Go Back</a>
        </Button>
      </div>
    </div>
  )
}

export default PageNotFound;