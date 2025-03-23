const express = require('express');
const adherentController = require('../controllers/adherentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Appliquer la protection d'authentification à toutes les routes
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Member management
 */

/**
 * @swagger
 * /api/adherents:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all members
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
 *                     $ref: '#/components/schemas/Member'
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: Member created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.route('/')
  .get(adherentController.getAllAdherents)
  .post(authorize('admin', 'manager'), adherentController.createAdherent);

/**
 * @swagger
 * /api/adherents/{id}:
 *   get:
 *     summary: Get a member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *       401:
 *         description: Not authorized
 *   patch:
 *     summary: Update a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
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
 *               telephone:
 *                 type: string
 *               poids:
 *                 type: number
 *               taille:
 *                 type: number
 *               objectif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Member not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       204:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.route('/:id')
  .get(adherentController.getAdherent)
  .patch(authorize('admin', 'manager'), adherentController.updateAdherent)
  .delete(authorize('admin'), adherentController.deleteAdherent);

/**
 * @swagger
 * /api/adherents/{id}/abonnements:
 *   get:
 *     summary: Get subscriptions of a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       404:
 *         description: Member not found
 *       401:
 *         description: Not authorized
 */
router.get('/:id/abonnements', adherentController.getAbonnementsAdherent);

/**
 * @swagger
 * /api/adherents/{id}/suivi-poids:
 *   get:
 *     summary: Get weight tracking history of a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Weight tracking history
 *       404:
 *         description: Member not found
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Add a weight tracking entry
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - poids
 *             properties:
 *               poids:
 *                 type: number
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Weight tracking entry added
 *       400:
 *         description: Bad request
 *       404:
 *         description: Member not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id/suivi-poids', adherentController.getSuiviPoids);
router.post('/:id/suivi-poids', authorize('admin', 'manager'), adherentController.ajouterSuiviPoids);

/**
 * @swagger
 * /api/adherents/with-active-subscriptions:
 *   get:
 *     summary: Get all members with active subscriptions
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members with active subscriptions
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/with-active-subscriptions', authorize('admin', 'manager'), adherentController.getAdherentsWithActiveSubscriptions);

module.exports = router; 