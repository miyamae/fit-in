import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import { blobToBase64 } from '../lib/blob-to-base64';

export default function Home() {
  const [srcImage, setSrcImage] = useState();
  const [blobUrl, setBlobUrl] = useState('');
  const { register, handleSubmit, errors } = useForm();

  const cropperRef = useRef<HTMLImageElement>(null);

  const onSubmit = (form: any) => {
    convertImage(form.image[0]);
  };

  async function convertImage(file: any) {
    const imageBase64 = await blobToBase64(file);
    const res = await axios.post('/api/convert', { params: { blob: imageBase64 } });
    setSrcImage(res.data.blob);
  }

  const download = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const dataUrl = cropper.getCroppedCanvas().toDataURL();
    setBlobUrl(dataUrl);
  };

  return (
    <>
      <p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input name="image" type="file" ref={register({ required: true })} />
          {errors.image && <span>This field is required</span>}
          <input type="submit" />
        </form>
      </p>
      <p>
        <a download="download" onClick={download} href={blobUrl}>
          Download
        </a>
      </p>
      <p>
        <Cropper
          src={srcImage}
          style={{ height: 600, width: 600 }}
          preview=".preview"
          guides={true}
          ref={cropperRef}
        />
      </p>
      <p>
        <div
          className="preview"
          style={{
            display: 'inline-block',
            padding: '10px',
            boxSizing: 'border-box',
            border: '1px solid black',
            width: '100%',
            float: 'left',
            height: '300px',
            overflow: 'hidden',
          }}
        />
      </p>
    </>
  );
}
