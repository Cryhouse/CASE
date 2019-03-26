const mongoose = require("./node_modules/mongoose");
const employeeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    sales: Number
});
const carmodelSchema = new mongoose.Schema({
    id: Number,
    brand: String,
    model: String,
    price: Number
});
const salesSchema = new mongoose.Schema({
   id: Number,
   carmodel_id: String,
   employee_id: String
})
const total_salesSchema = new mongoose.Schema({
    id: Number,
    name: String,
    total_sales: Number
})
module.exports = {employeeSchema:employeeSchema, carmodelSchema:carmodelSchema,salesSchema:salesSchema,total_salesSchema:total_salesSchema}