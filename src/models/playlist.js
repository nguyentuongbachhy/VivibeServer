'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.belongsTo(models.User, { foreignKey: 'userId' });
      Playlist.belongsToMany(models.Song, {
        through: 'PlaylistSong',
        foreignKey: 'playlistId'
      });
    }
  }
  Playlist.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    userId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};