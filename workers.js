require("dotenv").config();

export const workers = [
  {
    user: process.env.ANASTASIA,
    all: true,
    work: {
      start: 15,
      end: 19,
    },
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
];
