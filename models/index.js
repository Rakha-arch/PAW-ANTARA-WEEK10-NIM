const sequelize = require('../config/database');
const Product = require('./product.model');
const Admin = require('./admin.model');
const Chat = require('./chat.model');

// Relasi ke Admin
Admin.hasMany(Chat, { foreignKey: 'user_id' });
Chat.belongsTo(Admin, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Product,
  Admin,
  Chat,
};