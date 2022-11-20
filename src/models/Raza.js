const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = sequelize => {
  // defino el modelo

  sequelize.define(
    "Raza",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      breedGroup: {
        type: DataTypes.STRING,
        defaultValue: "No breed",
      },
      minYearsOfLife: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      maxYearsOfLife: {
        type: DataTypes.INTEGER,
        defaultValue: 15,
      },
      minHeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      maxHeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      minWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      maxWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(1000),
        validate: {
          isUrl: true,
        },
      },
    },
    { timestamps: false }
  );
};
