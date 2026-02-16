import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db/connection";

class Property extends Model {
  public id!: number;
  public userId!: number;
  public title!: string | null;
  public dailyPrice!: number | null;
  public weeklyPrice!: number | null;
  public monthlyPrice!: number;
  public currency!: 'ZAR' | 'USD';
  public address!: string;
  public streetNumber!: string | null;
  public blockNumber!: string | null;
  public unitNumber!: string | null;
  public city!: string;
  public state!: string;
  public country!: string;
  public zipCode!: string | null;
  public latitude!: number | null;
  public longitude!: number | null;
  public bedrooms!: number;
  public bathrooms!: number;
  public sqmt!: number | null;
  public type!: 'room' | 'apartment' | 'house' | 'condo';
  public parking!: number | null;
  public description!: string | null;
  public petFriendly!: boolean;
  public sharing!: boolean;
  public status!: 'available' | 'unavailable' | 'flagged';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Property.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dailyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    weeklyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monthlyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.ENUM('ZAR', 'USD'),
      allowNull: false,
      defaultValue: 'ZAR',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streetNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blockNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unitNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bathrooms: {
      type: DataTypes.DECIMAL(3, 1), // Allow decimals like 0, 0.5, 1, 1.5, etc. (max 999.9)
      allowNull: true, // Bathrooms is optional
    },
    sqmt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('room', 'apartment', 'house', 'condo'),
      allowNull: false,
    },
    parking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    petFriendly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sharing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'unavailable', 'flagged'),
      allowNull: false,
      defaultValue: 'available',
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "properties",
    paranoid: true, // Enable soft deletes using deletedAt
  }
);

export default Property;

