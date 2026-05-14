/* ============================================================
   CAREMAP MORRIS - Resource data loader

   Loads directory listings from the directory API and exposes
   them as the global RESOURCES array for existing page scripts.
============================================================ */

(function () {
  "use strict";

  var DIRECTORY_API_URL = "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/resources/approved";

  if (!window.RESOURCES) {
    window.RESOURCES = [];
  }

  window.CareMapResourcesReady = fetch(DIRECTORY_API_URL, { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load directory data from " + DIRECTORY_API_URL);
      }
      return response.json();
    })
    .then(function (resources) {
      window.RESOURCES = Array.isArray(resources) ? resources : [];
      return window.RESOURCES;
    })
    .catch(function (error) {
      console.error(error);
      window.RESOURCES = [];
      return window.RESOURCES;
    });
})();
