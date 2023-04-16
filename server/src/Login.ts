import * as path from "path"
const Datastore = require("nedb");

export class Login {
    private db:any;
    constructor(){
        this.db = new Datastore({
            filename: path.join(__dirname, "user.db"),
            autoload: true
        })
    }

    getUsers(){
        return new Promise((resolve,reject)=>{
            this.db.find({},(err, users)=>{
                if(err){
                    console.log(err);
                    reject({msg:"error in db"});
                } else{
                    resolve(users)
                }
            })
        })
    }
    getUser(username, password){
        return new Promise((resolve, reject)=>{
           this.db.find({username: username},
            (err, user)=>{
                if(user.length>0){
                    if(password===user[0].password){
                        const {username} = user[0]
                        resolve({username})
                    }else{
                        console.log("username or password not valid")
                        reject({msg: "username or password not valid"})
                    }
                }else{
                    console.log("username or password not valid")
                    reject({msg:"user not found"})
                }
               
            }
           )
        })
    }

    signinUser(username, password){
        return new Promise((resolve, reject)=>{
            this.db.insert({username: username, password:password},
                (err, user)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve({username: user.username})
                    }
                }    
            )
        })
    }
}