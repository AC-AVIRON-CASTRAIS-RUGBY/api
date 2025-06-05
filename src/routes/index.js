const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'API en ligne 🚀 ! Documentation sur /doc'});
});

module.exports = router;
