const requests=require('requests')                        ///Requiring requests module()

const express=require('express');
const fs=require('fs');
const path=require('path');
const app=express();
const hbs=require('hbs');

const filePath=path.join(__dirname,"public");
app.use(express.static(filePath))

const dirPath=path.join(__dirname,"/templates/views")
app.set("view engine","hbs")
app.set("views",dirPath)

const parPath=path.join(__dirname,"/templates/partials")
hbs.registerPartials(parPath)

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/about",(req,res)=>{
    res.render("about");
})

///This method involves the method of streaming ie readbable and writable streams.By using '.on' function we are using the event method and there are some pre defined event method already available with streaming method. Using some of that    
app.get("/weather",(req,res)=>{
    requests(`http://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&appid=5987e7f3135450a0dad7ac96ee8ad7c6`)              ///// adjusting name according to the query string given in the url by using '``' backticks
    .on("data",(chunkData)=>{
        const jsonObj=JSON.parse(chunkData);     
        // console.log(jsonObj);
        console.log(req.query);                                                                                      ////// the api called is in a string format so to make it in js object use this method
        const arrObj=[jsonObj];
        if(arrObj[0].cod===200)
        {
            const cel=(arrObj[0].main.temp)-273.15                   //// converting kelvin into in celcius
            // Math.round(cel)                                       ///rounding off the digits
            // cel.tofixed(2)                                         /// setprecision of 2 decimals places
            res.write(`<h1>City name is ${arrObj[0].name} and Temp there is ${cel.toFixed(1)} Celsius </h1>`);             /// This would write the detalis on the web page
        }
        else 
        {
            res.write("<h1>There is no such City. Enter Valid City</h1>")
        }

    })
    .on("end",()=>{
        res.send();
    }).on("error",(err)=>{
        res.send(err);
    })
})
app.get("/about/*",(req,res)=>{
    res.render("404",{
        error1:"Go back there is no such page in about"
    })
})
app.get("*",(req,res)=>{
    res.render("404",{
        error:"Oops there is no such page available"
    })
})
app.listen(8000);
  

// api.openweathermap.org/data/2.5/weather?q=Pune&appid=5987e7f3135450a0dad7ac96ee8ad7c6    /// this is the api we got from open weather api and we need to call this api in order to get data 






