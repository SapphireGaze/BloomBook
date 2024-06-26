import express from "express";

import WeedModel from "../models/weed.model";

import run from "../utils/gemini";
import { upload } from "../utils/upload";

const UploadRouter: express.Router = express.Router();

UploadRouter.post(
  "/",
  upload.single("photo"),
  async (req: express.Request, res: express.Response) => {
    try {
      const { latitude, longitude } = req.body;

      const data: string = await run(
        req.file?.path as string,
        req.file?.mimetype as string
      );

      const cleanData: string = data
        .replace(/"/g, "'")
        .replace(/\r?\n|\r/g, " ");

      new WeedModel({
        latitude: latitude,
        longitude: longitude,
        data: cleanData,
        file_path: req.file?.path,
      }).save();

      console.log({ data: cleanData });
      res.status(200).json({ data: cleanData });
    } catch (err) {
      console.error("Error uploading file:", (err as Error).message);
      res.status(401).send({ error: (err as Error).message });
    }
  }
);

export default UploadRouter;
