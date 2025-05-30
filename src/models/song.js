'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.belongsTo(models.Artist, { foreignKey: 'artistId', as: 'artist' });
      Song.belongsTo(models.Album, { foreignKey: 'albumId', as: 'album' });
      Song.belongsToMany(models.Genre, {
        through: 'SongGenre',
        foreignKey: 'songId'
      });
      Song.belongsToMany(models.Playlist, {
        through: 'PlaylistSong',
        foreignKey: 'songId'
      });
      Song.hasMany(models.ListeningHistory, { foreignKey: 'songId' });
      Song.hasMany(models.Comment, { foreignKey: 'songId', as: 'comments' });
    }
  }
  Song.init({
    title: DataTypes.STRING,
    thumbnailUrl: DataTypes.STRING,
    artistId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
    audio: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    lyrics: DataTypes.TEXT,
    views: DataTypes.BIGINT,
    likes: DataTypes.INTEGER,
    climaxStart: DataTypes.INTEGER,
    climaxEnd: DataTypes.INTEGER,
    dominantColor: DataTypes.INTEGER,
    commentBranchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comment',
        key: 'id'
      }
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};