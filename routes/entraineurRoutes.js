const express = require('express');
const entraineurController = require('../controllers/entraineurController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Appliquer la protection d'authentification à toutes les routes
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: Coach management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Coach:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - telephone
 *         - num_coach
 *         - specialite
 *         - date_emb
 *         - sal_base
 *       properties:
 *         nom:
 *           type: string
 *           description: Coach last name
 *         prenom:
 *           type: string
 *           description: Coach first name
 *         email:
 *           type: string
 *           format: email
 *           description: Coach email address
 *         telephone:
 *           type: string
 *           description: Coach phone number
 *         adresse:
 *           type: object
 *           properties:
 *             rue: { type: string }
 *             ville: { type: string }
 *             codePostal: { type: string }
 *             pays: { type: string }
 *         num_coach:
 *           type: string
 *           description: Coach ID number
 *         specialite:
 *           type: string
 *           enum: ['Musculation', 'Cardio', 'Fitness', 'Yoga', 'Pilates', 'CrossFit', 'Natation', 'Arts martiaux', 'Nutrition', 'Autre']
 *           description: Coach speciality
 *         date_emb:
 *           type: string
 *           format: date
 *           description: Hiring date
 *         sal_base:
 *           type: number
 *           description: Base salary
 *         certifications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nom: { type: string }
 *               organisme: { type: string }
 *               dateObtention: { type: string, format: date }
 *               dateExpiration: { type: string, format: date }
 *         experience:
 *           type: number
 *           description: Years of experience
 */

/**
 * @swagger
 * /api/entraineurs:
 *   get:
 *     summary: Get all coaches
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all coaches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coach'
 *   post:
 *     summary: Create a new coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       201:
 *         description: Coach created successfully
 *       400:
 *         description: Bad request
 */
router.route('/')
  .get(entraineurController.getAllEntraineurs)
  .post(authorize('admin', 'manager'), entraineurController.createEntraineur);

/**
 * @swagger
 * /api/entraineurs/{id}:
 *   get:
 *     summary: Get a coach by ID
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     responses:
 *       200:
 *         description: Coach details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Coach'
 *   patch:
 *     summary: Update a coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               specialite:
 *                 type: string
 *               sal_base:
 *                 type: number
 *     responses:
 *       200:
 *         description: Coach updated successfully
 *   delete:
 *     summary: Delete a coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     responses:
 *       204:
 *         description: Coach deleted successfully
 */
router.route('/:id')
  .get(entraineurController.getEntraineur)
  .patch(authorize('admin', 'manager'), entraineurController.updateEntraineur)
  .delete(authorize('admin'), entraineurController.deleteEntraineur);

/**
 * @swagger
 * /api/entraineurs/{id}/horaires:
 *   get:
 *     summary: Get schedules for a coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     responses:
 *       200:
 *         description: List of coach's schedules
 */
router.get('/:id/horaires', entraineurController.getHorairesEntraineur);

/**
 * @swagger
 * /api/entraineurs/{id}/disponibilites:
 *   get:
 *     summary: Get availabilities for a coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     responses:
 *       200:
 *         description: List of coach's availabilities
 */
router.get('/:id/disponibilites', entraineurController.getDisponibilitesEntraineur);

/**
 * @swagger
 * /api/entraineurs/{id}/carrieres:
 *   get:
 *     summary: Get career history for a coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     responses:
 *       200:
 *         description: Coach's career history
 */
router.get('/:id/carrieres', entraineurController.getCarrieresEntraineur);

/**
 * @swagger
 * /api/entraineurs/{id}/disponibilites:
 *   post:
 *     summary: Create an availability for a coach
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coach ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_dispo
 *               - heure_debut
 *               - heure_fin
 *             properties:
 *               date_dispo:
 *                 type: string
 *                 format: date
 *               heure_debut:
 *                 type: string
 *               heure_fin:
 *                 type: string
 *               recurrence:
 *                 type: string
 *                 enum: ['Aucune', 'Hebdomadaire', 'Mensuelle']
 *     responses:
 *       201:
 *         description: Availability created successfully
 */
router.post('/:id/disponibilites', entraineurController.createDisponibilite);

/**
 * @swagger
 * /api/entraineurs/disponibles:
 *   get:
 *     summary: Get available coaches
 *     tags: [Coaches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date for availability
 *       - in: query
 *         name: heure_debut
 *         schema:
 *           type: string
 *         required: true
 *         description: Start time (HH:MM)
 *       - in: query
 *         name: heure_fin
 *         schema:
 *           type: string
 *         required: true
 *         description: End time (HH:MM)
 *     responses:
 *       200:
 *         description: List of available coaches
 */
router.get('/disponibles', entraineurController.getEntraineursDisponibles);

module.exports = router; 