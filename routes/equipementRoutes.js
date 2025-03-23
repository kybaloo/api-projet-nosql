const express = require('express');
const equipementController = require('../controllers/equipementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Appliquer la protection d'authentification à toutes les routes
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: Gym equipment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - numero
 *         - nom
 *         - fonction
 *         - quantite
 *         - salle
 *       properties:
 *         numero:
 *           type: string
 *           description: Equipment ID number
 *         nom:
 *           type: string
 *           description: Equipment name
 *         fonction:
 *           type: string
 *           enum: ['Cardio', 'Musculation', 'Poids libres', 'Cours collectifs', 'Autre']
 *           description: Equipment function
 *         description:
 *           type: string
 *           description: Equipment description
 *         quantite:
 *           type: number
 *           description: Equipment quantity
 *           minimum: 1
 *         salle:
 *           type: string
 *           description: Gym ID reference
 *         marque:
 *           type: string
 *           description: Equipment brand
 *         modele:
 *           type: string
 *           description: Equipment model
 *         dateAchat:
 *           type: string
 *           format: date
 *           description: Purchase date
 *         prixAchat:
 *           type: number
 *           description: Purchase price
 *         dateDerniereMaintenance:
 *           type: string
 *           format: date
 *           description: Last maintenance date
 *         etat:
 *           type: string
 *           enum: ['Neuf', 'Bon', 'Correct', 'Usé', 'À réparer', 'Hors service']
 *           description: Equipment condition
 */

/**
 * @swagger
 * /api/equipements:
 *   get:
 *     summary: Get all equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all equipment
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
 *                     $ref: '#/components/schemas/Equipment'
 *   post:
 *     summary: Create new equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipment'
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *       400:
 *         description: Bad request
 */
router.route('/')
  .get(equipementController.getAllEquipements)
  .post(authorize('admin', 'manager'), equipementController.createEquipement);

/**
 * @swagger
 * /api/equipements/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Equipment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Equipment'
 *   patch:
 *     summary: Update equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Equipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               fonction:
 *                 type: string
 *               quantite:
 *                 type: number
 *               etat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipment updated successfully
 *   delete:
 *     summary: Delete equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Equipment ID
 *     responses:
 *       204:
 *         description: Equipment deleted successfully
 */
router.route('/:id')
  .get(equipementController.getEquipement)
  .patch(authorize('admin', 'manager'), equipementController.updateEquipement)
  .delete(authorize('admin'), equipementController.deleteEquipement);

/**
 * @swagger
 * /api/equipements/disponibles:
 *   get:
 *     summary: Get all available equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available equipment
 */
router.get('/disponibles', equipementController.getEquipementsDisponibles);

/**
 * @swagger
 * /api/equipements/fonction/{fonction}:
 *   get:
 *     summary: Get equipment by function
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fonction
 *         schema:
 *           type: string
 *           enum: ['Cardio', 'Musculation', 'Poids libres', 'Cours collectifs', 'Autre']
 *         required: true
 *         description: Equipment function
 *     responses:
 *       200:
 *         description: List of equipment by function
 */
router.get('/fonction/:fonction', equipementController.getEquipementsByFonction);

/**
 * @swagger
 * /api/equipements/{id}/signaler:
 *   patch:
 *     summary: Report equipment as needing repair
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Equipment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentaire:
 *                 type: string
 *                 description: Comment on the issue
 *     responses:
 *       200:
 *         description: Equipment marked for repair
 */
router.patch('/:id/signaler', equipementController.signalerEquipementAReparer);

/**
 * @swagger
 * /api/equipements/{id}/reparer:
 *   patch:
 *     summary: Mark equipment as repaired
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Equipment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etat:
 *                 type: string
 *                 enum: ['Neuf', 'Bon', 'Correct', 'Usé']
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipment marked as repaired
 */
router.patch('/:id/reparer', equipementController.marquerEquipementRepare);

module.exports = router; 