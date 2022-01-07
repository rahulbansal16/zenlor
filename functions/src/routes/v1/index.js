const express = require('express');
const vendorRoute = require('./vendor.route');
const bomRoute = require('./bom.route')
const router = express.Router();

const defaultRoutes = [
  {
    path: '/vendor',
    route: vendorRoute,
  },
  {
    path: '/bom',
    route: bomRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
