import React from "react";
import { Grid, Typography, Button, Box, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" className="bg-gray-900 text-gray-300 mt-16">
      <Box className="max-w-7xl mx-auto px-6 py-12">
        <Grid container spacing={25} className = "justify-center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4 text-white">
              Company
            </Typography>
            <div className="flex flex-col space-y-2">
              {["About", "Blog", "Jobs", "Press", "Partners"].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: "#9ca3af",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4 text-white">
              Solutions
            </Typography>
            <div className="flex flex-col space-y-2">
              {[
                "Marketing",
                "Analytics",
                "Commerce",
                "Insights",
                "Support",
              ].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: "#9ca3af",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4 text-white">
              Documentation
            </Typography>
            <div className="flex flex-col space-y-2">
              {["Guides", "API Status"].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: "#9ca3af",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4 text-white">
              Legal
            </Typography>
            <div className="flex flex-col space-y-2">
              {["Claim", "Privacy", "Terms"].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: "#9ca3af",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </Grid>
        </Grid>

        <Grid
            item
            xs={12}
            className="pt-8 border-t border-gray-800 mt-8 text-center"
          >
            <Typography variant="body2" sx={{ color: "#9ca3af", pb: 1 }}>
              &copy; {new Date().getFullYear()} My Company. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Made with ❤️ by{" "}
              <Link
                href="https://www.facebook.com/angthanh.943948"
                underline="hover"
                sx={{ color: "#9ca3af", "&:hover": { color: "#ffffff" } }}
              >
                Billian
              </Link>
            </Typography>
          </Grid>
      </Box>
    </Box>
  );
};

export default Footer;
