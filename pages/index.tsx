import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {
  Typography,
  Link,
  Box,
  Grid,
  Button,
  ButtonGroup,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import {
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Crop,
  OpenWith,
  SwapHoriz,
  SwapVert,
} from '@material-ui/icons';
import { blobToBase64 } from '../lib/blob-to-base64';
import Layout from './components/layout';
import InputSlider from './components/input-slider';

export default function Home() {
  const [srcImage, setSrcImage] = useState<string>();
  const [moveMode, setMoveMode] = useState<boolean>(false);
  const [cropData, setCropData] = useState<any>({});
  const [blobUrl, setBlobUrl] = useState<string>();
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotate, setRotate] = useState<number>(0);
  const { register, handleSubmit, errors } = useForm();

  const cropperRef = useRef<HTMLImageElement>(null);
  const imageElement: any = cropperRef?.current;
  const cropper: any = imageElement?.cropper;

  const onSubmit = (form: any) => {
    convertImage(form.image[0]);
  };

  async function convertImage(file: any) {
    setSrcImage((await blobToBase64(file)) as string);
  }

  const download = () => {
    const dataUrl = cropper.getCroppedCanvas().toDataURL();
    setBlobUrl(dataUrl);
  };

  const handleZoom = (event: Cropper.ZoomEvent<HTMLImageElement>): void => {
    setZoom(event.detail.ratio as number);
  };

  const handleCrop = (event: Cropper.CropEvent<HTMLImageElement>): void => {
    setCropData(event.detail);
  };

  const setZoomValue = (value: number): void => {
    cropper.zoomTo(value);
  };

  const setRotateValue = (value: number): void => {
    setRotate(value);
    cropper.rotateTo(value);
  };

  const toggleMoveMode = (): void => {
    cropper.setDragMode(moveMode ? 'crop' : 'move');
    setMoveMode(!moveMode);
  };

  const swapHoriz = (): void => {
    cropper.scaleX(cropper.getData().scaleX * -1);
  };

  const swapVert = (): void => {
    cropper.scaleY(cropper.getData().scaleY * -1);
  };

  return (
    <Layout>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          fit-in
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input name="image" type="file" ref={register({ required: true })} />
          {errors.image && <span>This field is required</span>}
          <input type="submit" />
        </form>
        <p>
          <Button variant="contained" color="primary">
            Hello World
          </Button>
          <Link download="download" onClick={download} href={blobUrl}>
            Download
          </Link>
        </p>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Cropper
              src={srcImage}
              style={{ height: 600, width: '100%' }}
              preview=".preview"
              guides={true}
              zoom={handleZoom}
              ref={cropperRef}
              dragMode="crop"
              toggleDragModeOnDblclick={false}
              crop={handleCrop}
            />
          </Grid>
          <Grid item xs={4}>
            <div style={{ height: 200 }}>
              <div
                className="preview"
                style={{
                  display: 'block',
                  boxSizing: 'border-box',
                  background: 'black',
                  width: 200,
                  height: 200,
                  overflow: 'hidden',
                }}
              />
            </div>
            <Grid container spacing={2}>
              <Grid item>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                  <ToggleButton onClick={toggleMoveMode} selected={moveMode}>
                    <OpenWith />
                  </ToggleButton>
                  <ToggleButton onClick={toggleMoveMode} selected={!moveMode}>
                    <Crop />
                  </ToggleButton>
                  <Button onClick={swapHoriz}>
                    <SwapHoriz />
                  </Button>
                  <Button onClick={swapVert}>
                    <SwapVert />
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
            <InputSlider
              setValue={setZoomValue}
              value={zoom}
              min={0.1}
              max={5.0}
              step={0.01}
              incStep={0.1}
              IncIcon={ZoomIn}
              DecIcon={ZoomOut}
              unit="%"
            />
            <InputSlider
              setValue={setRotateValue}
              value={rotate}
              min={-180}
              max={180}
              step={1}
              incStep={1}
              IncIcon={RotateRight}
              DecIcon={RotateLeft}
              unit="°"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="幅(W)"
                  type="number"
                  value={Math.round(cropData.width)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="高さ(H)"
                  type="number"
                  value={Math.round(cropData.height)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="左位置(X)"
                  type="number"
                  value={Math.round(cropData.x)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="上位置(Y)"
                  type="number"
                  value={Math.round(cropData.y)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
            <br />
            resize: [width] x [height]
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
