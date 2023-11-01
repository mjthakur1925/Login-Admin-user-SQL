
// test.js
const { User } = require('./userDetails'); // Import your Sequelize User model
const express = require('express');
const router = express.Router();

router.get('/Users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await User.findAll({
      limit,
      offset,
    });

    const totalUsers = await User.count();

    const pageCount = Math.ceil(totalUsers / limit);

    const results = {
      users,
      totalUsers,
      pageCount,
    };

    res.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
