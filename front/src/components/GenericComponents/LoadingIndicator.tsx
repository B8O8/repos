import React from 'react'
import { CALCULATED_WIDTH } from '../../utils/constants'
import { CircularProgress } from '@mui/material'


function LoadingIndicator() {

    return (
        <div style={{width: CALCULATED_WIDTH, height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <CircularProgress size={40} />
        </div>        
    )
}

export default LoadingIndicator
