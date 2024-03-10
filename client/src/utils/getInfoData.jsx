var _ = require('lodash');

export const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
