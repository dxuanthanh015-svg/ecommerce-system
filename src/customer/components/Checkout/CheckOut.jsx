import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';

const steps = ['Login', 'Add Delivery Address', 'Order Summary', 'Payment'];

export default function CheckOut() {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate(`?step=${step+1}`)
  };

  const handleBack = () => {
    navigate(`?step=${step - 1}`)
  };

  const location = useLocation();
  const querySearch = new URLSearchParams(location.search);

  const step = Number(querySearch.get("step")) || 0;

  return (
    <div className='px-10 lg:px-20 mt-10'>
        <Box sx={{ width: '100%' }}>
      <Stepper activeStep={step}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {step === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={step === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} >
              {step === steps.length - 1 ? 'Finish' : 'Next'}              
            </Button>
          </Box>

          <div>
            ădadasd
          </div>
        </React.Fragment>
      )}
    </Box>
    </div>
  );
}
