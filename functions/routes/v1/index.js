const express = require('express');
const vendorRoute = require('./vendor.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/vendor',
    route: vendorRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
