var StickNFind = require('./index');



StickNFind.discover(function(sticknfind){
  
  sticknfind.connect(function(){
		console.log("connected");

		sticknfind.discoverServicesAndCharacteristics(function(){
			console.log("hi");
		});

  });

  sticknfind.once('disconnect', function() {
    process.exit(0);
  });  

});