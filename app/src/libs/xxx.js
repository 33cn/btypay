// 用来获取和设置 删除 localStorage 存储



let local = {

    save(key, value) {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    fetch(key) {
        return JSON.parse(localStorage.getItem(key)) || {}
    },

    del(key) {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }

}

// 用来获取和设置 删除 indexDB 存储
let myDB = {
    name: "yzh_integral",
    version: 1,
    db: null,
    ojstore: {
        name: "cart", //存储空间表的名字
        keypath: "id" //主键
    }
};

let indexDB = {
    indexedDB: window.indexedDB || window.webkitindexedDB,
    IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange, //键范围
    openDB: function (myDB, callback) {
        //建立或打开数据库，建立对象存储空间(ObjectStore)
        var self = this;
        var version = myDB.version || 1;
        var request = self.indexedDB.open(myDB.name, version);

        request.onerror = function (e) {
            console.log(e.currentTarget.error.message);
        };

        request.onsuccess = function (e) {
            myDB.db = e.target.result;
            console.log('成功建立并打开数据库:' + myDB.name + ' version' + version);
            callback();
        };

        request.onupgradeneeded = function (e) {
            var db = e.target.result,
                transaction = e.target.transaction,
                store;

            if (!db.objectStoreNames.contains(myDB.ojstore.name)) {
                //没有该对象空间时创建该对象空间
                store = db.createObjectStore(myDB.ojstore.name, {
                    keyPath: myDB.ojstore.keypath
                });
                console.log('成功建立对象存储空间：' + myDB.ojstore.name);
            }
        }
    },

    deletedb: function (dbname) {
        //删除数据库
        var self = this;
        self.indexedDB.deleteDatabase(dbname);
        console.log(dbname + '数据库已删除')
    },

    closeDB: function (db) {
        //关闭数据库
        db.close();
        console.log('数据库已关闭')
    },

    addData: function (db, storename, data) {
        //添加数据，重复添加会报错
        var self = this;
        var store = store = db.transaction(storename, 'readwrite').objectStore(storename),
        request;
        for (var i = 0; i < data.length; i++) {
            request = store.add(data[i]);
            request.onerror = function () {
                console.log('add添加数据库中已有该数据')
                self.putData(db, storename, data);
            };

            request.onsuccess = function () {
                console.log('add添加数据已存入数据库')
            };
        }
    },

    putData: function (db, storename, data) {
        //添加数据，重复添加会更新原有数据
        for (var i = 0; i < data.length; i++) {
            if (data[i].id) {
                var modData = data[i];
                this.getDataByKey(db, storename, modData.id, function (res) {
                    res.totalCount += modData.totalCount;
                    var store = db.transaction(storename, 'readwrite').objectStore(storename),
                        request;
                    request = store.put(res);
                    request.onsuccess = function () {
                        console.log('put添加数据已存入数据库')
                    };
                })
            };
        }
    },

    getAllData(db, storename, callback) {
        //获取所有数据
        var store = db.transaction(storename, 'readwrite').objectStore(storename);
        var allRecords = store.getAll();
        allRecords.onsuccess = function () {
            console.log(allRecords.result);
            if (typeof (callback) === 'function') {
                callback(allRecords.result);
            }
        };
    },

    getDataByKey: function (db, storename, key, callback) {
        //根据存储空间的键找到对应数据
        var store = db.transaction(storename, 'readwrite').objectStore(storename);
        var request = store.get(key);
        request.onerror = function () {
            console.log('getDataByKey error');
        };
        request.onsuccess = function (e) {
            var result = e.target.result;
            console.log('查找数据成功', result)
            if (typeof (callback) === 'function') {
                callback(result);
            }
        };
    },

    deleteData: function (db, storename, key) {
        //删除某一条记录
        var store = store = db.transaction(storename, 'readwrite').objectStore(storename);
        store.delete(key)
        console.log('已删除存储空间' + storename + '中' + key + '记录');
    },

    clearData: function (db, storename) {
        //删除存储空间全部记录
        var store = db.transaction(storename, 'readwrite').objectStore(storename);
        store.clear();
        console.log('已删除存储空间' + storename + '全部记录');
    }

}




//****************添加数据****************************;

// this.$indexDB.addData(myDB.db, myDB.ojstore.name, cartData);



// ****************获取所有数据****************************;

// this.$indexDB.getAllData(myDB.db, myDB.ojstore.name);



//*******************put重复添加*************************;

// this.$indexDB.putData(myDB.db,myDB.ojstore.name,cartData);



//*******************获取指定数据*************************";

// this.$indexDB.getDataByKey(

// myDB.db,

// myDB.ojstore.name,

// cartData[0].id

// );

//******************删除数据1001************;

// this.$indexDB.deleteData(myDB.db,myDB.ojstore.name,1001);



//******************删除全部数据************;

// this.$indexDB.clearData(myDB.db,myDB.ojstore.name);



//******************关闭数据库************;

// this.$indexDB.closeDB(myDB.db);



//******************删除数据库************;

// this.$indexDB.deletedb(myDB.name);

export default {
    install: function (vm) {
        vm.prototype.$local = local;
        vm.prototype.$myDB = myDB;
        vm.prototype.$indexDB = indexDB;
    }
}