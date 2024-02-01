import { faker } from '@faker-js/faker';
export const __msg_mock__ = [
  {
    id: 0,
    text: 'Today',
    type: 'TIMELINE'
  },
  {
    id: 1,
    from: '9999',
    to: '123',
    text: faker.lorem.sentence(),
    type: 'TEXT'
  },
  {
    id: 2,
    from: '123',
    to: '9999',
    text: faker.lorem.sentence(),
    type: 'TEXT'
  },
  {
    id: 3,
    from: '9999',
    to: '123',
    text: faker.lorem.sentence(),
    type: 'TEXT'
  },
  {
    id: -1,
    text: '11:03',
    type: 'TIMELINE'
  },
  {
    id: 4,
    from: '123',
    to: '9999',
    text: faker.lorem.sentence(),
    type: 'TEXT'
  },
  {
    id: 5,
    from: '9999',
    to: '',
    text: faker.lorem.sentence(),
    type: 'TEXT'
  },
  {
    id: 6,
    from: '9999',
    to: '',
    text: faker.lorem.sentence(),
    type: 'TEXT'
  },
  {
    id: 7,
    from: '123',
    to: '',
    image: faker.image.urlLoremFlickr(),
    type: 'IMAGE'
  },
  {
    id: 8,
    from: '9999',
    to: '',
    image: faker.image.urlLoremFlickr(),
    type: 'IMAGE'
  },
  {
    id: 9,
    from: '9999',
    to: '',
    text: 'file.doc',
    doc: faker.image.urlLoremFlickr(),
    type: 'DOC'
  },
  {
    id: 10,
    from: '123',
    to: '',
    text: 'this_is_a_file.txt',
    doc: faker.image.urlLoremFlickr(),
    type: 'DOC'
  }
];
