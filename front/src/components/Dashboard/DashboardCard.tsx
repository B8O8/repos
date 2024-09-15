import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Icon } from "@mui/material";
import classes from "./styles.module.css"; // Import CSS for custom styles

interface Props {
  title: string;
  value: string;
  icon: string;
}

function DashboardCard(props: Props) {
  const { title, value, icon } = props;

  return (
    <Card className={classes.card} sx={{ boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{ mt: 2, fontWeight: "bold" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;

// import React from "react";
// import classes from "./styles.module.css";
// import { Box } from "@mui/material";

// interface Props {
//   title: string;
//   value: string;
// }

// function DashboardCard(props: Props) {
//   const { title, value } = props;

//   return (
//     <Box sx={{ boxShadow: 5 }}>
//       <div className={classes.gridCardContainer}>
//         <span>{title}</span>
//         <span>{value}</span>
//       </div>
//     </Box>
//   );
// }

// export default DashboardCard;
