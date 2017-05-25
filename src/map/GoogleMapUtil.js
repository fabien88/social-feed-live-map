export const typecastRoutes = (routes) => {
  routes.forEach((route) => {
    route.bounds = asBounds(route.bounds);
        // I don't think `overview_path` is used but it exists on the
        // response of DirectionsService.route()
    route.overview_path = asPath(route.overview_polyline);

    route.legs.forEach((leg) => {
      leg.start_location = asLatLng(leg.start_location);
      leg.end_location = asLatLng(leg.end_location);

      leg.steps.forEach((step) => {
        step.start_location = asLatLng(step.start_location);
        step.end_location = asLatLng(step.end_location);
        step.path = asPath(step.polyline);
      });
    });
  });
};

function asBounds(boundsObject) {
  return new google.maps.LatLngBounds(asLatLng(boundsObject.southwest),
                                    asLatLng(boundsObject.northeast));
}

function asLatLng(latLngObject) {
  return new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
}

function asPath(encodedPolyObject) {
  return google.maps.geometry.encoding.decodePath(encodedPolyObject.points);
}
