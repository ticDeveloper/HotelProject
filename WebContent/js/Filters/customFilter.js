app.filter('filterBoolean', function () {
  return function (item) {
     if(item=="true") return "Si";
     else return "No";
  };
});
