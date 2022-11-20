const { Router } = require("express");
const axios = require("axios");
const router = Router();
const { Breeds } = require("../db.js");

router.get("/", async (req, res) => {
  const apiData = await axios.get("https://api.thedogapi.com/v1/breeds");
  const breeds = await apiData.data.map(el =>
    el.breed_group ? el.breed_group : "No breed"
  );
  try {
    breeds.map(async el => {
      await Breeds.findOrCreate({
        where: {
          name: el,
        },
      });
    });

    const allBreeds = await Breeds.findAll();

    res.status(200).send(allBreeds);
  } catch {
    res.status(404).json({ e: "Error fetching breeds" });
  }
});

module.exports = router;
