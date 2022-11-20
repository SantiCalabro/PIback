const { Router } = require("express");
const { Temperament } = require("../db.js");
const axios = require("axios");
const router = Router();
router.get("/", async (req, res) => {
  let dbTemper = await Temperament.findAll();
  if (dbTemper.length) {
    return res.send(dbTemper);
  } else {
    let apiTemper = await axios.get("https://api.thedogapi.com/v1/breeds");
    let mappedTemps = apiTemper.data.map(el => el.temperament);
    let joinedTemps = mappedTemps.join();
    let arr = joinedTemps.split(",");
    let corrected = arr.map(el => (el[0] === " " ? el.slice(1) : el));
    try {
      corrected.map(el =>
        el.length > 0
          ? Temperament.findOrCreate({
              where: {
                name: el,
              },
            })
          : el
      );
      let find = await Temperament.findAll();

      res.status(200).send(find);
    } catch {
      res.status(404).json({ error: "Error fetching temperaments" });
    }
  }
});

module.exports = router;
