export const formatErrors = (errors) => {
  return Object.keys(errors).map((key) => ({
    name: key,
    errors: errors[key]
  }));
};
