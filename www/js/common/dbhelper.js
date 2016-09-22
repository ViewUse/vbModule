function insert(tbname, sqlData, callBack) {
	if (fgDB != null) {
		var now = new Date();
		fgDB.insert(tbname, sqlData, function(insertId) {
			if (callBack) {
				callBack(true, insertId);
			}
		}, function(er) {
			console.log('error with executeSql', er);
			Ext.Msg.alert('错误', "插入失败！");
			if (callBack) {
				callBack(false, "插入失败:" + er);
			}
		});
	}
}

function update(tbname, sqlData) {
	if (fgDB != null) {
		fgDB.update(tbname, sqlData, "id=?", [sqlData.id], function(count) {
			if (callBack) {
				callBack(true);
			}
		}, function(er) {
			console.log('error with executeSql', er);
			Ext.Msg.alert('错误', "修改失败！");
			if (callBack) {
				callBack(false, "修改失败:" + er);
			}
		});
	}
}

function del(tbname, id) {
	if (fgDB != null) {
		fgDB.del(tbname, "id=?", [id], function(count) {
			if (callBack) {
				callBack(true);
			}
		}, function(er) {
			console.log('error with executeSql', er);
			Ext.Msg.alert('错误', "删除失败！");
			if (callBack) {
				callBack(false, "删除失败:" + er);
			}
		});
	}
}