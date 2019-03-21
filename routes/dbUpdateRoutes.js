// var express = require("express");
// var app = express();
// var request = require("request");
// var cheerio = require("cheerio");


// module.exports = function (app) {

 
//   function scrapeCubeData(callback) {
//     // Define our data template
//     var data = [{
//       lakeName: "High Rock",
//       data: []
//     }, {
//       lakeName: "Badin",
//       data: []
//     }, {
//       lakeName: "Tuckertown",
//       data: []
//     }];
//     // Make request for cub carolinas site, returns html
//     request("http://ww2.cubecarolinas.com/lake/tabs.php", function (error, response, html) {

//       // Load the HTML into cheerio and save it to a variable
//       // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//       var $ = cheerio.load(html);

//       // With cheerio, find each <td> on the page
//       // (i: iterator. element: the current element)
//       $('tr').each(function (i, element) {
//         // var value = $(this).text();
//         var value = $(element).children().text();

//         // Skip over the first few sections of data to get to the stuff we need
//         if (i > 7) {
//           // If the current value is high rock
//           if (value.substring(0, 1) === "H") {
//             date = value.substring(9, 19);
//             elev = value.substring(19, 25);
//             data[0].data.push({
//               date: date,
//               elev: elev
//             });
//           }
//           // If the current value is Badin
//           if (value.substring(0, 1) === "B") {
//             date = value.substring(15, 25);
//             elev = value.substring(25, 31);
//             data[1].data.push({
//               date: date,
//               elev: elev
//             });
//           }
//           // If Tuckertown
//           if (value.substring(0, 1) === "T") {
//             date = value.substring(10, 20);
//             elev = value.substring(20, 26);
//             data[2].data.push({
//               date: date,
//               elev: elev
//             });
//           }
//         }
//       });
//       callback(null, data);
//     });
//   };

//   function updateCubeDB() {
//     scrapeCubeData(function (error, data) {
//       if (error) {
//         response.send(error);
//         return;
//       } else {
//         const updateData = [];
//         updateData.push({
//           bodyOfWater: "High Rock",
//           level: data[0].data[0]
//         });
//         updateData.push({
//           bodyOfWater: "Badin",
//           level: data[1].data[0]
//         })
//         updateData.push({
//           bodyOfWater: "Tuckertown",
//           level: data[2].data[0]
//         })

//         updateData.forEach(function (e) {
//           db.model("State").update(
//             { "bodyOfWater": e.bodyOfWater },
//             { $set: { currentLevel: e.level }}
//           )
//         })
//       }
//     })
//   }

//   updateCubeDB();


//   // Route to retrieve a single lake's data from db

//   // db.model("State").find({
//   //   //   state : stateName 
//   //   "lakes.href": hrefMatch
//   // })
//   //   .exec(function (err, data) {
//   //     if (err) {
//   //       res.send("There was a problem querying the database");
//   //     } else {
//   //       console.log(data);
//   //       res.json(data);
//   //     }
//   //   })





// }; // End of module.exports