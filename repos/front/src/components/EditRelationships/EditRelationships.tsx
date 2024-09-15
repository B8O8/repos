import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUserUpdateRelationships } from "../../utils/interfaces/IUser";
import AccountApiService from "../../utils/apis/accounts";
import { Button, TextField } from "@mui/material";
import classes from "./styles.module.css";
import PageTitle from "../PageTitle/PageTitle";
import { ToastType, notify } from "../../utils/helpers";

function EditRelationships() {
  const { id } = useParams();
  const [fullname, setFullname] = useState<string>("");
  const [chargedAmount, setChargedAmount] = useState<string>("");
  const [CashOut, setCashOut] = useState<string>("0");
  const [formData, setFormData] = useState<
    {
      uplineId: number;
      commission: string;
      fullname: string;
      level: number;
    }[]
  >([]);

  const fetchData = async () => {
    if (!id) return;
    const user = await AccountApiService.getUser(parseInt(id));

    setChargedAmount(user?.charged?.toString() || "");
    setCashOut(user?.cashout?.toString() || "0");
    fetchUplines(user?.charged || 0); // Use charged since dispensed will be equal
    setFullname(
      user?.firstName && user.lastName ? user?.firstName + " " + user?.lastName : ""
    );
  };

  const fetchUplines = async (amount: number) => {
    const results = await AccountApiService.getUplines(id || "");
    setFormData(
      results
        .map((result) => ({
          uplineId: result.id,
          fullname: result.firstName + " " + result.lastName,
          commission: result.commissionChunk?.toString() || "",
          level: result.level || 1,
        }))
        .sort((a, b) => a.level - b.level)
    );
  };

  const submit = async () => {
    if (!id) return;
    
    const downlineId = parseInt(id);
    
    const requestArray: IUserUpdateRelationships[] = formData.map((e) => ({
      uplineId: e.uplineId,
      commissionChunk: parseFloat(e.commission),
      downlineId,
    }));
    
    const request = {
      relationships: requestArray,
      charged: parseFloat(chargedAmount),
      dispensed: parseFloat(chargedAmount),  // Dispensed should be the same as charged
      cashout: parseFloat(CashOut),          // Pass cashout correctly
    };
  
    const response = await AccountApiService.updateRelationships(request);
  
    if (response) {
      notify("Updated successfully", ToastType.SUCCESS);
      setTimeout(() => {
        window.history.back();
      }, 500);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePercentageChange = (index: number, value: string) => {
    // Update the percentage in the state
    setFormData((prevFormData) => {
      const updatedPercentages = [...prevFormData];
      updatedPercentages[index].commission = alwaysAsNumber(value).toString();
      return updatedPercentages;
    });
  };

  const alwaysAsNumber = (val: string): number => {
    let f = parseFloat(val);
    if (isNaN(f)) return 0;
    return f;
  };

  const checkIsDisabled = () => {
    const uplinesTotal = formData.reduce(
      (partialSum, a) => partialSum + alwaysAsNumber(a.commission),
      0
    );
    
    const cashOutFloat = alwaysAsNumber(CashOut);
    const chargedFloat = alwaysAsNumber(chargedAmount);
  
    // Calculate total uplines commissions + cashout
    const totalAmount = uplinesTotal + cashOutFloat;
  
    // Check if the totalAmount matches the chargedAmount
    return chargedFloat <= 0 || totalAmount !== chargedFloat;
  };

  return (
    <>
      <PageTitle
        title={`Edit Relationships ${fullname ? ` - ${fullname}` : ""}`}
      />
      <div className={classes.chargedContainer}>
        <TextField
          type="number"
          value={chargedAmount}
          onChange={(e) => setChargedAmount(e.target.value)}
          label="Charged"
        />
        <TextField
          type="number"
          value={CashOut}
          onChange={(e) => setCashOut(e.target.value)}
          label="Cash Out"
        />
      </div>
      <h4>Uplines commissions</h4>

      <div className={classes.container}>
        {formData.map((formRow, index) => (
          <div key={index}>
            <label>
              {formRow.fullname} - Level {formRow.level}
            </label>
            <TextField
              defaultValue={formRow.commission}
              onChange={(e) => handlePercentageChange(index, e.target.value)}
            />
          </div>
        ))}
        <Button disabled={checkIsDisabled()} onClick={submit}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default EditRelationships;
