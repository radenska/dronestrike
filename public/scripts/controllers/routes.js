'use strict';
page('/',
homeController.index,
Data.fetchAll);

page('/map', mapController.index);
page('/stats', chartController.index);
page('/about', aboutController.index);

// page('/somalia', countryController.index);
// page('/yemen', countryController.index);
// page('/pakistan', countryController.index);
page();
