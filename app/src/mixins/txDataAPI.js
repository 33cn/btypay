import { createNamespacedHelpers } from "vuex";
import sq3 from "sqlite3";

const { mapState } = createNamespacedHelpers("Account");


export default {
    data() {
        return {
            dbFilePath: "",
            DB: null,
        }
    },
    computed: {

    },
    methods: {
        loadDB(){
            console.log("xxxxx")
            // this.DB = new sqlite3.Database(this.dbFilePath)
            // let sqlstr = "CREATE TABLE hello (a int, b char);";
            // sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
            // sqlstr += "INSERT INTO hello VALUES (1, 'world');"
            // this.DB.run(sqlstr)
            // var res = db.exec("SELECT * FROM hello");
            // console.log(res)
        },
        addList() {

        },
        addTx() {

        },
        getList() {

        },
        getTx() {

        }
    },
    mounted() {

    }
}