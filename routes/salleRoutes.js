const express = require('express');
const salleController = require('../controllers/salleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Appliquer la protection d'authentification à toutes les routes
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Gyms
 *   description: Gym facilities management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gym:
 *       type: object
 *       required:
 *         - nom
 *         - numero_salle
 *         - adresse_salle
 *         - capacite
 *       properties:
 *         nom:
 *           type: string
 *           description: Gym name
 *         numero_salle:
 *           type: string
 *           description: Gym facility number
 *         adresse_salle:
 *           type: object
 *           required:
 *             - rue
 *             - ville
 *             - codePostal
 *           properties:
 *             rue:
 *               type: string
 *               description: Street address
 *             ville:
 *               type: string
 *               description: City
 *             codePostal:
 *               type: string
 *               description: Postal code
 *             pays:
 *               type: string
 *               description: Country
 *         capacite:
 *           type: number
 *           description: Maximum capacity
 *         telephone:
 *           type: string
 *           description: Gym phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Gym email address
 *         horaires:
 *           type: object
 *           properties:
 *             lundi: { type: object }
 *             mardi: { type: object }
 *             mercredi: { type: object }
 *             jeudi: { type: object }
 *             vendredi: { type: object }
 *             samedi: { type: object }
 *             dimanche: { type: object }
 */

/**
 * @swagger
 * /api/salles:
 *   get:
 *     summary: Get all gyms
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all gyms
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
 *                     $ref: '#/components/schemas/Gym'
 *   post:
 *     summary: Create a new gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gym'
 *     responses:
 *       201:
 *         description: Gym created successfully
 *       400:
 *         description: Bad request
 */
router.route('/')
  .get(salleController.getAllSalles)
  .post(authorize('admin'), salleController.createSalle);

/**
 * @swagger
 * /api/salles/{id}:
 *   get:
 *     summary: Get a gym by ID
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     responses:
 *       200:
 *         description: Gym details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Gym'
 *   patch:
 *     summary: Update a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *               horaires:
 *                 type: object
 *     responses:
 *       200:
 *         description: Gym updated successfully
 *   delete:
 *     summary: Delete a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     responses:
 *       204:
 *         description: Gym deleted successfully
 */
router.route('/:id')
  .get(salleController.getSalle)
  .patch(authorize('admin', 'manager'), salleController.updateSalle)
  .delete(authorize('admin'), salleController.deleteSalle);

/**
 * @swagger
 * /api/salles/{id}/equipements:
 *   get:
 *     summary: Get equipment for a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     responses:
 *       200:
 *         description: List of gym's equipment
 */
router.get('/:id/equipements', salleController.getEquipementsSalle);

/**
 * @swagger
 * /api/salles/{id}/abonnements:
 *   get:
 *     summary: Get subscriptions for a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     responses:
 *       200:
 *         description: List of gym's subscriptions
 */
router.get('/:id/abonnements', salleController.getAbonnementsSalle);

/**
 * @swagger
 * /api/salles/{id}/entraineurs:
 *   get:
 *     summary: Get coaches working at a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     responses:
 *       200:
 *         description: List of coaches at the gym
 */
router.get('/:id/entraineurs', salleController.getEntraineursSalle);

/**
 * @swagger
 * /api/salles/{id}/taux-occupation:
 *   get:
 *     summary: Get occupancy rate for a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     responses:
 *       200:
 *         description: Gym's occupancy rate
 */
router.get('/:id/taux-occupation', salleController.getTauxOccupation);

/**
 * @swagger
 * /api/salles/{id}/equipements:
 *   post:
 *     summary: Add equipment to a gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Gym ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipment'
 *     responses:
 *       201:
 *         description: Equipment added successfully
 */
router.post('/:id/equipements', salleController.addEquipement);

module.exports = router; 