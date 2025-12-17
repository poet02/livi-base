import { DataTypes, Model } from "sequelize";
import { compareSync } from "../util/encrypt";
import sequelizeConnection from "../db/connection";

class User extends Model {
  public id!: number;
  public name!: string;
  public surname!: string;
  // public email!: string;
  // public password!: string;
  public mobile!: string;

  // public status!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // static validPassword: (password: string, hash: string) => boolean;
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
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   unique: true,
    // },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    regionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "regions",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    
    // password: {
    //   type: DataTypes.STRING,
    // },
    // status: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 1,
    // },
    // role: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 2,
    // },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
  }
);

// User.validPassword = (password: string, hash: string) => {
//   return compareSync(password, hash);
// };

export default User;
