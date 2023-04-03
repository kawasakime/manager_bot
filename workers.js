require("dotenv").config();

const workers = [
  {
    user: process.env.ANASTASIA,
    all: false,
    days: [
      {},
      {
        start: 0,
        end: 0,
      },
      {
        start: 11,
        end: 19,
      },
      {
        start: 15,
        end: 19,
      },
      {
        start: 15,
        end: 19,
      },
      {
        start: 15,
        end: 19,
      },
      {},
    ],
  },
  {
    user: process.env.NIKOLAY,
    all: true,
    work: {
      start: 10,
      end: 14,
    },
  },
  {
    user: process.env.VALERIA,
    all: false,
    days: [
      {},
      {
        start: 10,
        end: 16,
      },
      {
        start: 10,
        end: 16,
      },
      {
        start: 10,
        end: 16,
      },
      {
        start: 10,
        end: 16,
      },
      {
        start: 10,
        end: 14,
      },
      {},
    ],
  },
  {
    user: process.env.KONSTANTIN,
    all: false,
    days: [
      {},
      {
        start: 13,
        end: 19
      },
      {
        start: 0,
        end: 0
      },
      {
        start: 16,
        end: 19
      },
      {
        start: 0,
        end: 0,
      },
      {
        start: 10,
        end: 19
      },
      {},
    ],
  },
];


module.exports = workers