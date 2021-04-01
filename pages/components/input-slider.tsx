import React, { useState, useRef } from 'react';
import 'cropperjs/dist/cropper.css';
import styled from 'styled-components';
import { IconButton, Grid, Slider, InputAdornment, TextField } from '@material-ui/core';

const SmallTextField = styled(TextField)`
  .MuiInputBase-root {
    width: 70px;
  }
  input {
    padding: 2px;
    font-size: 0.8rem;
  }
`;

export default function InputSlider({
  setValue,
  value,
  min,
  max,
  step,
  incStep = null,
  unit = null,
  IncIcon,
  DecIcon,
}) {
  const handleChangeSlider = (_event: React.ChangeEvent<{}>, value: number | number[]): void => {
    setValue(value);
  };
  const increment = (): void => {
    setValue(value + (incStep || step));
  };
  function decrement(): void {
    setValue(value - (incStep || step));
  }
  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(event.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={1}>
        <IconButton size="small" onClick={decrement}>
          <DecIcon />
        </IconButton>
      </Grid>
      <Grid item xs={7}>
        <Slider min={min} max={max} step={step} value={value} onChange={handleChangeSlider} />
      </Grid>
      <Grid item xs={1}>
        <IconButton size="small" onClick={increment}>
          <IncIcon />
        </IconButton>
      </Grid>
      <Grid item xs={3}>
        <SmallTextField
          type="number"
          value={value}
          onChange={handleInputText}
          InputProps={{
            endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  );
}
