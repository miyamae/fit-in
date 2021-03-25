import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const b64src = req.body.params.blob.split(',');
  const buf = Buffer.from(b64src[1], 'base64');
  sharp(buf)
    .resize(200)
    .toBuffer((err, data, info) => {
      if (err) {
        throw err;
      }
      res.statusCode = 200;
      res.json({ blob: b64src[0] + ',' + data.toString('base64') });
    });
};
