const Joi = require("joi");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const schemas= require("./schemas");




app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



mongoose.connect("mongodb://localhost/carshop", { useNewUrlParser: true }) // Denna connection string skall komma från en configurations file
    .then (() => console.log("Connected to carshop's database..."))
    .catch((err) => console.error("There was an error in connecting to the database", err));


const Model = mongoose.model("carmodels", schemas.carmodelSchema);

async function getModels() {
    return await Model
    .find()
    .select({Model:0});
}
async function printModels () {
    const result = await getModels();
    console.log(result);
}

// getting employees and printing their names

const Employee = mongoose.model("employees", schemas.employeeSchema);

async function getEmployees() {
    return await Employee
    .find();
}
async function getEmployeesWithoutSales() {
    return await Employee
    .find()
    .select({sales:0});  //Här kan det väljas vilka delar man vill kolla på. Eftersom vi vill kolla på alla utom sales
}

async function printEmployees () { // for test purposes
    return await getEmployees();
    
}
//Employees


// getting sales and calculating sale amounts

const Sales = mongoose.model("sales", schemas.salesSchema);
const Tot_sales = mongoose.model("totsales", schemas.total_salesSchema);

//
async function getSalesById() {
    return await Sales
    .find();
}

async function getSales() { //Returnerar ett en lista med objekt. 
    const salesById = await getSalesById();
    const models = await getModels();
    const employees = await getEmployees();

    for (var i = 0; i<salesById.length;i++) {
        var emp_id = salesById[i].employee_id;
        var model_id = salesById[i].carmodel_id;
        for (var j = 0; j< models.length; j++) {
            if (models[j].id == model_id) {
                for (var k = 0; k < employees.length;k++) {
                    if (employees[k].id == emp_id) {
                        employees[k].sales += models[j].price;
                        }                       
                    }                   
                }
            }
        }
    return employees;
    }

async function printSales() {
    const result = await getSales();
    console.log(result);
}
async function updateSales() {
    /* För att uppdatera sales med värden från sales-dokumentet i mongoDB. Returnerar det nya resultatet. Dela upp "New_sales" och "Total_sales" i mån av tid och applicera denna funktion endast på new_sales. */
    const employees = await getSales();
    const employees_old = await Employee.find().select({id:1,sales:1});
    
    for (index in employees) {
        for (index2 in employees_old) {
            if (employees[index].id == employees_old[index2].id) {
                employees_old[index2].sales = employees[index].sales;
            }
        }
    }
    const result = []
    for (x in employees_old) {
        const update = await Employee.findById(employees[x]._id);
        update.sales = employees_old[x].sales;
        var partres = await update.save();
        result.push(partres);
        
    }
    return result;
}

app.get("/employees",(req,res) => {
    // Validate req +
    async function send() {
        const print = await getEmployeesWithoutSales();
        res.send(print);
    }
    send();
})

app.get("/total_sales",(req,res) => {
    // Validate req +
    async function send() {
        const print = await printEmployees();
        res.send(print);
    }
    send();
})

app.get("/carmodels",(req,res) => {
    // Validate req +
    async function send() {
        const print = await getModels();
        res.send(print);
    }
    send();
})

app.post("/carmodels", (req,res) =>{
    async function getOldId() {
        const result = await Model.find({},{_id:0,id:1}).select({id:1}).sort({id:-1}).limit(1);
        return result[0].id;
    }
    async function createModel(model,brand,price) {
        model = model || "New_model";
        brand = brand || "Another brand";
        price = price || 0
        const old_id = await getOldId();
        const new_model = new Model({
            id: old_id + 1,
            model: model,
            brand: brand,
            price: price
            });
        return await new_model.save()
    }
    async function send() {
        const print = await createModel();
        res.send(print);
    }
    send();
    
    
});

app.delete("/carmodels/:model", (req,res) => {
    async function getModel() {
        const result = await Model.find({model:"335i"},{_id:0,model:1});
        return result[0].model;
    }
    async function deleteModel(model) {
        const model_name = await getModel();
        const result = await Model.deleteOne({"model":model});
        return result;
    }
    async function send() {
        const print = await Model.find({model:req.params.model});
        //const status = await deleteModel(req.params.model);
         
        res.send(print);
    }
    send();
    
});


async function testprint(){ //for testpurposes
    var result = await getSales();
    console.log(result);
}


app.listen(3000);