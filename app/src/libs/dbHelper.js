export function initDB() {
    console.log("xxx")
}


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
            console.log("init db success")
        }

        request.onupgradeneeded = e => {
            this.DB = e.target.result
            this.createTable(tableName, tableData)
            console.log("db upgrade success")
        }

        request.onerror = e => {
            console.log("init db error")
        }
    }

    createTable(tableName, tableData) {
        if (this.DB && !this.DB.objectStoreNames.contains(tableName) && tableData.keyPath) {
            let objectStore = this.DB.createObjectStore(tableName, tableData.keyPath)
            for (let index of tableData.index) {
                objectStore.createIndex(index.name, index.name, index.payload)
            }
            console.log("table create success")
        }
    }

    insert(data) {
        if (this.DB) {
            let request = this.DB.transaction([this.TableName], 'readwrite').objectStore(this.TableName).add(data)

            request.onsuccess = e => {
                console.log("insert success")
            }

            request.onerror = e => {
                console.log("insert error")
            }
        }
    }

    selectByPage(id, num, callback) {
        let boundKeyRange = null
        if (id !== 0) {
            boundKeyRange = IDBKeyRange.upperBound(id);
        }
        let objectStore = this.DB.transaction([this.TableName]).objectStore(this.TableName)
        let request = objectStore.openCursor(boundKeyRange, "prev")
        request.onsuccess = e => {
            let cursor = e.target.result
            if (cursor && num !== 0) {
                callback(cursor.value)
                cursor.continue()
                num--
            } else {
                console.log("end")
            }
        }

        request.onerror = e => {
            console.log("cursor error")
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
