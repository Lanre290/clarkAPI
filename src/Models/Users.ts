import { DataTypes, Model } from "sequelize";
const sequelize = require("./../setup/Sequelize");

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_active_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },

    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
