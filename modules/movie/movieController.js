const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  //
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, sort, searchName, searchRelease } = request.query;
      page = +page || 1;
      limit = +limit || 5;
      sort = sort || "id ASC";
      searchName = searchName || "";
      searchRelease = searchRelease || "MONTH(releaseDate)";

      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(
        searchName,
        searchRelease
      );

      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        movieShown: totalData,
        allMovie: await movieModel.getCountMovie("", "MONTH(releaseDate)"),
      };

      const result = await movieModel.getAllMovie(
        limit,
        offset,
        sort,
        searchName,
        searchRelease
      );

      if (!result.length) {
        return helperWrapper.response(response, 404, "Not Found", null);
      }

      redis.setEx(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return helperWrapper.response(
        response,
        200,
        "Success get all data !",
        result,
        pageInfo
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  getMovieById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          "404",
          `Data by id ${id} not found`
        );
      }

      // simpan data ke redis as cache
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  createMovie: async (request, response) => {
    console.log(request.file);
    try {
      const {
        name,
        category,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
      } = request.body;

      let fileName = null;
      if (request.file) {
        const [, type] = request.file.mimetype.split("/");
        fileName = `${request.file.filename}.${type}`;
      }

      const setData = {
        name,
        category,
        image: fileName,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
        createdAt: new Date(Date.now()),
      };

      const result = await movieModel.createMovie(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        400,
        "Bad Request, try reuploading the image",
        null
      );
    }
  },

  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;

      const {
        name,
        category,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
      } = request.body;

      const movie = await movieModel.getMovieById(id);

      if (!movie.length) {
        return helperWrapper.response(
          response,
          400,
          `id: ${id} not found`,
          null
        );
      }

      if (movie[0].image && request.file) {
        const [imageName] = movie[0].image.split(".");
        await cloudinary.uploader.destroy(imageName, (error, result) =>
          console.log(error, result)
        );
      }

      let fileName = null;
      if (request.file) {
        const [, type] = request.file.mimetype.split("/");
        fileName = `${request.file.filename}.${type}`;
      }

      const setData = {
        name,
        category,
        image: fileName,
        director,
        casts,
        releaseDate,
        duration,
        synopsis,
        updatedAt: new Date(Date.now()),
      };

      Object.keys(setData).forEach((value) => {
        if (!setData[value]) {
          delete setData[value];
        }
      });

      const result = await movieModel.updateMovie(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "update movie failed", null);
    }
  },

  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;

      const movie = await movieModel.getMovieById(id);

      if (!movie.length) {
        return helperWrapper.response(
          response,
          400,
          `id: ${id} not found`,
          null
        );
      }

      if (movie[0].image) {
        console.log("doleate");
        const [imageName] = movie[0].image.split(".");
        await cloudinary.uploader.destroy(imageName, (error, result) => {
          console.log(error, result);
        });
      }

      const result = await movieModel.deleteMovie(id);
      return helperWrapper.response(response, 200, "data deleted !", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, `delete data failed`, null);
    }
  },
};
