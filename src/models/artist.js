'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Artist.hasMany(models.Song, { foreignKey: 'artistId', as: 'artist' });
      Artist.hasMany(models.Album, { foreignKey: 'artistId' });
    }
  }
  Artist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};