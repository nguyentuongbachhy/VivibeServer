'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.hasMany(models.Song, { foreignKey: 'albumId', as: 'songs' });
      Album.belongsTo(models.Artist, { foreignKey: 'artistId', as: 'artist' });
    }
  }
  Album.init({
    title: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    artistId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};