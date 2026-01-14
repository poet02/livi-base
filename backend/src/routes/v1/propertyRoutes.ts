import { Router } from 'express';
import { requireUser, validateRequest } from '../../middleware';
import {
  createPropertyController,
  getPropertyController,
  updatePropertyController,
  deletePropertyController,
} from '../../controllers/property';
import {
  getPresignedUrlsController,
  confirmImagesController,
  getPropertyImagesController,
} from '../../controllers/propertyImage';
import {
  createPropertySchema,
  updatePropertySchema,
  getPresignedUrlsSchema,
  confirmImagesSchema,
} from '../../validation/property';

const propertyRouter = Router();

// Property CRUD routes
propertyRouter.post(
  '/',
  requireUser,
  validateRequest(createPropertySchema),
  createPropertyController
);

propertyRouter.get('/:id', requireUser, getPropertyController);

propertyRouter.patch(
  '/:id',
  requireUser,
  validateRequest(updatePropertySchema),
  updatePropertyController
);

propertyRouter.delete('/:id', requireUser, deletePropertyController);

// Property image routes
propertyRouter.post(
  '/:id/images/upload-urls',
  requireUser,
  validateRequest(getPresignedUrlsSchema),
  getPresignedUrlsController
);

propertyRouter.post(
  '/:id/images/confirm',
  requireUser,
  validateRequest(confirmImagesSchema),
  confirmImagesController
);

propertyRouter.get('/:id/images', requireUser, getPropertyImagesController);

export default propertyRouter;

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management endpoints
 */

/**
 * @swagger
 * /v1/properties:
 *   post:
 *     summary: Create a new property
 *     description: Create a new property listing
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monthlyPrice
 *               - currency
 *               - address
 *               - city
 *               - state
 *               - country
 *               - bedrooms
 *               - bathrooms
 *               - sqmt
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               monthlyPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [ZAR, USD]
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               sqmt:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [apartment, house, condo]
 *     responses:
 *       "201":
 *         description: Property created successfully
 */

/**
 * @swagger
 * /v1/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     description: Get a specific property (must be the owner)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Property retrieved successfully
 *       "404":
 *         description: Property not found
 */

/**
 * @swagger
 * /v1/properties/{id}/images/upload-urls:
 *   post:
 *     summary: Get presigned URLs for image uploads
 *     description: Generate presigned URLs for uploading property images to S3
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - count
 *             properties:
 *               count:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *     responses:
 *       "200":
 *         description: Presigned URLs generated successfully
 */

/**
 * @swagger
 * /v1/properties/{id}/images/confirm:
 *   post:
 *     summary: Confirm image uploads
 *     description: Create image records after uploading to S3
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - s3Key
 *                     - s3Url
 *                     - order
 *                   properties:
 *                     s3Key:
 *                       type: string
 *                     s3Url:
 *                       type: string
 *                     order:
 *                       type: integer
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *     responses:
 *       "201":
 *         description: Images confirmed successfully
 */

