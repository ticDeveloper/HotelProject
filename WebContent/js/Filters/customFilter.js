app.filter('filterBoolean', function () {
  return function (item) {
     if(item=="true" || item==1) return "Si";
     else return "No";
  };
});
