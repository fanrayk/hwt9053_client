const Sequelize = require("sequelize");

class Respository{
    Model=null;
    constructor(model){
        this.Model=require('../models')[model];
    }

    create=async(data)=>{
        return await this.Model.create(data);
    }
}

module.exports=Respository;