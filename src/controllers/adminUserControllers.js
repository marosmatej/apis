const User = require('../models/userModel');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclude the password field
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};



const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.destroy({ where: { id } });
        if (user) {
            res.json({ message: `User with ID ${id} deleted successfully` });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const searchUsers = async (req, res) => {
    const { query } = req.query; // Example: ?query=admin
    try {
        const users = await User.findAll({
            where: {
                username: { [Op.like]: `%${query}%` }, // Sequelize example
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search users' , details:error});
    }
};


const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.update({ role }, { where: { id } }); 
        console.log(user)
        if (user[0]) {
            res.json({ message: `User with ID ${id} updated successfully`});
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update role' });
    }
};


module.exports = { getUsers , deleteUser, searchUsers, updateRole };