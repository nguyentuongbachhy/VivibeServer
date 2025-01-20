'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListeningHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ListeningHistory.belongsTo(models.User, { foreignKey: 'userId' });
      ListeningHistory.belongsTo(models.Song, { foreignKey: 'songId' });
    }
  }
  ListeningHistory.init({
    userId: DataTypes.UUID,
    songId: DataTypes.INTEGER,
    lastPlayedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'ListeningHistory',
  });
  return ListeningHistory;
};