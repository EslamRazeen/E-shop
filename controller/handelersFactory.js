const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndDelete(id);

    if (!documents) {
      return next(new ApiError(`This id "${id}" not found`, 404));
    }

    // Trigger 'deleteOne' event when document deleted
    // documents.deleteOne();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const documents = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!documents) {
      return next(new ApiError(`This id "${req.body.id}" not found`, 404));
    }

    // Trigger 'save' event when document updated
    documents.save(); // To execute Aggregation in update
    res.status(200).json({ data: documents });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params; // = const id = req.params.id
    // 1 Build query
    let query = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    // 2 Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`This id "${id}" not found`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build Query
    const documentCount = await Model.countDocuments(); // count the number of documents in database
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentCount)
      .filter()
      .limitFields()
      .sort()
      .search();

    // Execute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      reslut: documents.length,
      paginationResult,
      data: documents,
    });
  });
