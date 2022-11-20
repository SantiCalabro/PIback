const { Router } = require("express");
const { Raza, Temperament } = require("../db.js");
const router = Router();
const axios = require("axios");

const apiData = async () => {
  try {
    let getApi = await axios.get("https://api.thedogapi.com/v1/breeds");

    let dogs = getApi.data.map(el => {
      return {
        id: el.id,
        name: el.name,
        breedGroup: el.breed_group,
        temperaments: el.temperament
          ? el.temperament.split(", ")
          : ["No temperaments"],
        minYearsOfLife: parseInt(el.life_span.slice(0, 2)),
        maxYearsOfLife: parseInt(el.life_span.slice(5, 7)),
        minWeight: parseInt(el.weight.imperial.slice(0, 1)),
        maxWeight: parseInt(el.weight.imperial.slice(5, 7)),
        minHeight: parseInt(el.height.imperial.slice(0, 1)),
        maxHeight: parseInt(el.height.imperial.slice(5, 7)),
        image: el.image.url,
      };
    });

    return dogs;
  } catch (e) {
    console.log(e);
  }
};

const dbData = async () => {
  try {
    const dogs = await Raza.findAll({
      include: {
        model: Temperament,
        through: {
          attributes: [],
        },
      },
    });
    return dogs;
  } catch (e) {}
};

router.get("/", async (req, res) => {
  let { name } = req.query;
  const apiDogs = await apiData();
  const dbDogs = await dbData();
  const concatDogs = apiDogs.concat(dbDogs);

  if (name) {
    const byName = concatDogs.filter(el => el.name == name);
    return res.status(200).json(byName);
  }
  try {
    return res.status(200).json(concatDogs);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.get("/created", async (req, res) => {
  const dbDogs = await dbData();

  try {
    return res.status(200).json(dbDogs);
  } catch (e) {
    res.status(404).json({ e: "You haven't created any dog yet!" });
  }
});

router.get("/:idRaza", async (req, res) => {
  let { idRaza } = req.params;

  const apiDogs = await apiData();
  const dbDogs = await dbData();
  const concatDogs = apiDogs.concat(dbDogs);

  const filter = concatDogs.filter(el => el.id == idRaza);
  if (filter.length) return res.status(200).json(filter);
  else return res.status(404).json({ e: "La raza que buscas no existe" });
});

router.post("/", async (req, res) => {
  let {
    id,
    name,
    image,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    minYearsOfLife,
    maxYearsOfLife,
    breedGroup,
    temperaments,
  } = req.body;

  if (
    !name ||
    !minHeight ||
    !maxHeight ||
    !minWeight ||
    !maxWeight ||
    !breedGroup ||
    !temperaments
  ) {
    res.status(400).json("Faltan datos");
  } else {
    try {
      const dog = await Raza.create({
        id,
        name,
        minHeight,
        maxHeight,
        minWeight,
        maxWeight,
        minYearsOfLife,
        maxYearsOfLife,
        breedGroup,
        image,
      });

      let temp = await Temperament.findAll({
        where: {
          name: temperaments,
        },
      });

      await dog.addTemperament(temp);
      res.status(200).json(dog);
    } catch (e) {
      console.log(e);
    }
  }
});

router.put("/", async (req, res) => {
  let { id } = req.query;
  let {
    name,
    image,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    minYearsOfLife,
    maxYearsOfLife,
    breedGroup,
    temperaments,
  } = req.body;

  if (
    !name ||
    !minHeight ||
    !maxHeight ||
    !minWeight ||
    !maxWeight ||
    !breedGroup ||
    !temperaments
  ) {
    res.status(400).json("Faltan datos");
  } else {
    try {
      let dogId = await Raza.findByPk(id);
      console.log(dogId);
      await dogId.update({
        name,
        minHeight,
        maxHeight,
        minWeight,
        maxWeight,
        minYearsOfLife,
        maxYearsOfLife,
        breedGroup,
        image,
      });

      res.status(200).json(dogId);
    } catch (e) {
      res.status(400).json("Something went wrong" + e);
    }
  }
});

router.delete("/", async (req, res) => {
  let { id } = req.query;

  try {
    let dogId = await Raza.findByPk(id);
    await dogId.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json("Dog successfully deleted");
  } catch (e) {
    res.status(400).json("Something went wrong" + e);
  }
});

module.exports = router;
