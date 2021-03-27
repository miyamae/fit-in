import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styled from 'styled-components';
import {
  IconButton,
  Typography,
  Link,
  Box,
  Grid,
  Button,
  ButtonGroup,
  Slider,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { ZoomIn, ZoomOut, RotateLeft, RotateRight } from '@material-ui/icons';
import { blobToBase64 } from '../lib/blob-to-base64';
import Layout from './components/layout';

const SmallTextField = styled(TextField)`
  .MuiInputBase-root {
    width: 70px;
  }
  input {
    padding: 2px;
    font-size: 0.8rem;
  }
`;

export default function Home() {
  const [srcImage, setSrcImage] = useState<string>();
  const [blobUrl, setBlobUrl] = useState<string>();
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotate, setRotate] = useState<number>(1.0);
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
  const handleChangeZoom = (_event: React.ChangeEvent<{}>, newValue: number | number[]): void => {
    cropper.zoomTo(newValue);
  };
  const zoomIn = (): void => {
    cropper.zoom(0.1);
  };
  const zoomOut = (): void => {
    cropper.zoom(-0.1);
  };
  const handleInputZoom = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    cropper.zoomTo(event.target.value);
  };

  const setRotateValue = (value: number): void => {
    setRotate(value);
    cropper.rotateTo(value);
  };
  const handleChangeRotate = (_event: React.ChangeEvent<{}>, newValue: number | number[]): void => {
    setRotateValue(newValue as number);
  };
  const rotateRight = (): void => {
    setRotateValue(cropper.getData().rotate + 5);
  };
  const rotateLeft = (): void => {
    setRotateValue(cropper.getData().rotate - 5);
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
        <Grid container>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button>移動</Button>
            <Button>切取</Button>
          </ButtonGroup>
          &nbsp;
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={zoomIn}>拡大</Button>
            <Button onClick={zoomOut}>縮小</Button>
          </ButtonGroup>
          &nbsp;
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button>左回</Button>
            <Button>右回</Button>
          </ButtonGroup>
          &nbsp;
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button>上下</Button>
            <Button>左右</Button>
          </ButtonGroup>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Grid container>
              <Grid item>
                <IconButton size="small" onClick={zoomOut}>
                  <ZoomOut />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Slider min={0.1} max={5.0} step={0.01} value={zoom} onChange={handleChangeZoom} />
              </Grid>
              <Grid item>
                <IconButton size="small" onClick={zoomIn}>
                  <ZoomIn />
                </IconButton>
              </Grid>
              <Grid item>
                <SmallTextField
                  type="number"
                  value={zoom}
                  onChange={handleInputZoom}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container>
              <Grid item>
                <IconButton size="small" onClick={rotateLeft} disabled={rotate <= -180}>
                  <RotateLeft />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Slider
                  min={-180}
                  max={180}
                  step={1}
                  value={rotate}
                  onChange={handleChangeRotate}
                />
              </Grid>
              <Grid item>
                <IconButton size="small" onClick={rotateRight} disabled={rotate >= 180}>
                  <RotateRight />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <br />
        [left],[top] : [width] x [height]
        <br />
        resize: [width] x [height]
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Cropper
              src={srcImage}
              style={{ height: 600, width: '100%' }}
              preview=".preview"
              guides={true}
              zoom={handleZoom}
              ref={cropperRef}
            />
          </Grid>
          <Grid item xs={3}>
            <div
              className="preview"
              style={{
                display: 'inline-block',
                boxSizing: 'border-box',
                border: '1px solid black',
                width: '100%',
                height: '300px',
                overflow: 'hidden',
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
