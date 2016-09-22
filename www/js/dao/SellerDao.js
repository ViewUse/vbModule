var SellerDao = {
	/**
	 * 获得商家账号
	 * @param {Object} callback
	 */
	getLocalUser : function(callback) {
		var sql = "SELECT * FROM seller ";
		fgDB.executeSql(sql, function(res) {
			console.log(res);
			var item = null;
			if (res.rows.length > 0) {
				item = res.rows.item(0);
				callback(true, item);
			} else {
				callback(false);
			}
		})
	},
	/**
	 *更新交班信息
	 */
	addSeller : function(sqlData, callBack) {
		fgDB.insert("seller", sqlData, function(count) {
			if (callBack) {
				callBack(true);
			}
		}, function(er) {
			console.log('error with updateSeller', er);
			if (callBack) {
				callBack(false);
			}
		});
	},
	/**
	 * 删除所有商家数据
	 * @param {Object} callBack(success,err)
	 */
	deleteAllSeller : function(callBack) {
		var sql = "delete FROM seller ";
		fgDB.executeSql(sql, function(res) {
			if (callBack) {
				callBack(true)
			}
		}, function(err) {
			if (callBack) {
				callBack(false, err)
			}
		});
	},
	/**
	 * 更新登录时间
	 */
	updateLoginTime: function(seller, time, callBack) {
		var sql = "update seller set lastestlogtime='" + time + "' where userName='" + seller.userName + "'";
		fgDB.executeSql(sql, function(res) {
			if(callBack) callBack(true);
		}, function(err) {
			if(callBack) callBack(false, err);
		});
	}
}