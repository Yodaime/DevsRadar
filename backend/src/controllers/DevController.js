const axios = require('axios');
const Dev = require("../models/Dev");
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, longitude, latitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`/users/${github_username}`);

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return response.json(dev);
  },

  async update(request, response) {
    const { latitude, longitude } = request.body;

    const dev = await Dev.findOne({ _id: request.params.id });

    if (!dev) return response.status(404).json();

    let { location } = dev;

    if (latitude && longitude) {
      location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
    }

    await dev.updateOne(
      { github_username: dev.github_username, location, ...request.body },
      { new: true }
    );

    return response.json();
  },

  async destroy(request, response) {
    const Dev = await Dev.findOneAndDelete({ _id: request.params.id });

    return response.json();
  }
};