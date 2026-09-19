import { sendError } from "../utils/apiResponse.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (validatedData.body) req.body = validatedData.body;
    if (validatedData.query) req.query = validatedData.query;
    if (validatedData.params) req.params = validatedData.params;
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return sendError(res, 400, "Erreur de validation des données.", formattedErrors);
    }
    next(error);
  }
};
