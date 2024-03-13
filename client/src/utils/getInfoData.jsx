import _ from 'lodash';

export const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};