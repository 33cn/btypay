export class DBHelper {
    DB = null
    DBName = ""
    TableName = ""

    constructor(dbName, tableName, tableData) {
        this.delDB(dbName)
        this.DBName = dbName
        this.TableName = tableName
        let request = window.indexedDB.open(dbName)

        request.onsuccess = e => {
            this.DB = e.target.result
            // console.log("init db success")
        }

        request.onupgradeneeded = e => {
            this.DB = e.target.result
            this.createTable(tableName, tableData)
            // console.log("db upgrade success")
        }

        request.onerror = e => {
            // console.log("init db error")
        }
    }

    createTable(tableName, tableData) {
        if (this.DB && !this.DB.objectStoreNames.contains(tableName) && tableData.keyPath) {
            let objectStore = this.DB.createObjectStore(tableName, tableData.keyPath)
            if (tableData.index) {
                for (let index of tableData.index) {
                    objectStore.createIndex(index.name, index.key, index.payload)
                }
            }
            // console.log("table create success")
        }
    }

    insert(tableName, data) {
        if (this.DB) {
            let request = this.DB.transaction([tableName], 'readwrite').objectStore(tableName).add(data)

            request.onsuccess = e => {
                // console.log("insert success")
            }

            request.onerror = e => {
                // console.log("insert error")
            }
        }
    }

    selectByPage(tableName, id, num, callback) {
        let boundKeyRange = null
        if (id !== 0) {
            boundKeyRange = IDBKeyRange.upperBound(id);
        }
        let objectStore = this.DB.transaction([tableName]).objectStore(tableName)
        let request = objectStore.openCursor(boundKeyRange, "prev")
        request.onsuccess = e => {
            let cursor = e.target.result
            let list = []
            if (cursor && num !== 0) {
                list.push(cursor.value)
                cursor.continue()
                num--
            } else {
                callback(list)
                // console.log("end")
            }
        }

        request.onerror = e => {
            // console.log("cursor error")
        }
    }

    getCursorByIndex(tableName, indexName, indexVal, advanceNum, callback) {
        let objectStore = this.DB.transaction([tableName]).objectStore(tableName)
        let index = objectStore.index(indexName)
        if (index) {
            let request = index.openCursor(IDBKeyRange.only(indexVal), "prev")
            let advancing = true;
            request.onsuccess = e => {
                let cursor = e.target.result
                if (advancing && advanceNum) {
                    cursor.advance(advanceNum)
                    advancing = false
                } else {
                    callback(cursor)
                }
            }
        }
    }

    update() {

    }

    del() {

    }

    delDB(name) {
        window.indexedDB.deleteDatabase(name)
        console.log("db has deleted")
    }

    close() {
        this.DB.close()
        console.log("db has closed")
    }
}
