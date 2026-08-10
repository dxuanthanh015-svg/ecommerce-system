import React from "react";
import { Grid, Box, Avatar, Rating } from "@mui/material";

const ProductReviewCard = () => {
  return (
    <div>
      <Grid container spacing={2} className="py-3">
        <Grid size={{ xs: 3, sm: 2, md: 1.5, lg: 1 }}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 }, bgcolor: "#9155fd" }}
            >
              R
            </Avatar>
          </Box>
        </Grid>

        <Grid size={{ xs: 9, sm: 10, md: 10.5, lg: 11 }}>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-base sm:text-lg">Thành</p>
              <p className="opacity-70 text-xs sm:text-sm">{new Date().toLocaleString()}</p>
            </div>
          </div>
          <Rating value={4.5} name="half-rating" readOnly precision={.5} size="small"/>
          <p className="text-sm sm:text-base mt-1">I love the person who created this website</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductReviewCard;
