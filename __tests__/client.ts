import { createServer, RequestListener } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node/api-resolver';
import request from 'supertest';

export const testClient = (handler: NextApiHandler) => {
  const listener: RequestListener = (req, res) => {
    let query: any = {};
    let queryUrl = req.url?.split('?')[1]
    if (queryUrl) {
      queryUrl
        .split('&')
        .map((p) => [p.split('=')[0], p.split('=')[1]])
        .forEach((k) => {
          query[k[0]] = k[1]
        })
    }
    return apiResolver(
      req,
      res,
      query,
      handler,
      {
        previewModeEncryptionKey: '',
        previewModeId: '',
        previewModeSigningKey: '',
      },
      false
    )
  }
  return request(createServer(listener));
};