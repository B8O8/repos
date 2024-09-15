import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { ToastType, asFormattedDate, notify } from '../../utils/helpers';
import CommissionApiService from '../../utils/apis/commissions';


function MonthlyEmailForm() {
    const [from, setFrom] = useState<string>();
    const [to, setTo] = useState<string>();

    const submit = async() => {

        try{      
            if(!from || !to) return;
            await CommissionApiService.sendMonhtlyEmail(from, to);
            setTimeout(() => {
              notify("File uploaded successfully", ToastType.SUCCESS);
              setTimeout(() => {
                // window.location.reload();
              }, 1000);
            }, 2000);
          }catch(error: any) {
            notify("An error occured while uploading the file", ToastType.ERROR);
          }
    }



    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <DatePicker
            sx={{
            marginTop: "25px",
            marginBottom: "25px",

            }}
            value={from}
            name="dateFilter"
            onChange={(value) => setFrom(dayjs(value).toDate().toDateString())
            }
        />
        <DatePicker
            sx={{
                marginTop: "25px",
                marginBottom: "25px",
            }}
            value={to}
            name="dateFilter"
            onChange={(value) => setTo(dayjs(value).toDate().toDateString())
            }
        />
        <Button disabled={!from || !to}  style={{background: "#050d31", color: "white",marginRight: "15px"}}  onClick={() => submit()}>Send email</Button>
        </div>
    )
}

export default MonthlyEmailForm
