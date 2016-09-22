var ShopDao = {
	getLocalShop: function(data) {
		var sql = "SELECT * FROM Shop";
		fgDB.executeSql(sql, function(data) {
			console.log(data);
		});
	}
};