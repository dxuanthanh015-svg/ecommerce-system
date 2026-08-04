import React from "react";
import { Grid, Box, Avatar, Rating } from "@mui/material";

const ProductReviewCard = () => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 1 }}>
          <Box>
            <Avatar
              className="text-white "
              sx={{ width: 56, height: 56, bgcolor: "#9155fd" }}
            >
              R
            </Avatar>
          </Box>
        </Grid>

        <Grid size={{ xs: 9 }}>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-lg">Thành</p>
              <p className="opacity-70">{new Date().toLocaleString()}</p>
            </div>
          </div>
          <Rating value={4.5} name="half-rating" readOnly precision={.5}/>
          <p>I love the person who created this website</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductReviewCard;
