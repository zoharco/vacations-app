const express = require('express');
const { check } = require('express-validator');

const vacationsController = require('../controllers/vacations-controller');
const router = express.Router();
const { checkAuth, authoRole } = require('../middleware/check-auth');
const ROLE = require("../models/role")
router.get('/', vacationsController.getAllVacations);

router.get('/:vid', vacationsController.getVacationById);

// router.get('/user/:uid', vacationsController.getVacationsByUserId);

router.use(checkAuth);
router.post(
    '/', 
    authoRole(ROLE.ADMIN),
    [
        check('title').not().isEmpty(), 
        check('description').isLength({ min: 30 }), 
        check('price').not().isEmpty(), 
    ],
    vacationsController.createVacation
);


router.patch(
    '/:vid', 
    [
        check('title').not().isEmpty(), 
        check('description').isLength({ min: 30 }), 
        check('price').not().isEmpty(), 
    ],
    vacationsController.updateVacation
    );
    
    
router.delete('/:vid', vacationsController.deleteVacation);

module.exports = router;
