var Ice = require('ice-js');

var router = new Ice.Router;

router.mountPoint = '/easy';

router.path('/echo/:string', function(page){
  page.render(page.params.string);
});

module.exports = router;