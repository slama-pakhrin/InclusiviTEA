const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

let dataArray = []; 
let dataArrayLen = 0;

fs.createReadStream('city_database.csv')
  .pipe(csv())
  .on('data', (row) => {
   
    dataArray.push(row)
    })
    .on('end', row => {
        dataArray.forEach((row) => {
            row.ethnics = [[0,0],[0,0],[0,0]];
            // row.ethnics.african = [0,0]; //[1:rating, 1:reviewsCount]
            // row.ethnics.indigenous = [0,0];
            // row.ethnics.lgbtq = [0,0];
           dataArrayLen+=1;
        })
    })

let leaderBoard = []
let saveSearch = ""

app.use(express.static(path.join(__dirname, 'src')));

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/submit', (req, res) => {
    const formData = req.body.userSearch;
    const ratingAfricanData = req.body.userRatingAfrican;
    const ratingIndigenousData = req.body.userRatingIndigenous;
    const ratingLGBTQData = req.body.userRatingLGBTQ;
    if(formData != null) saveSearch = formData.toLowerCase();
    let foundValue = [];
    for(let i = 0; i < dataArrayLen; i++){
        if (Object.values(dataArray[i]).some(value => typeof value === 'string' && value.toLowerCase().includes(saveSearch))) {
            foundValue.push(dataArray[i]);
        }
    }
    if(ratingAfricanData > 0) {
        dataArray[foundValue[0].id].ethnics[0][0] = ratingAfricanData;
        dataArray[foundValue[0].id].ethnics[0][1] += 1;
    }
    if(ratingIndigenousData > 0){
        dataArray[foundValue[0].id].ethnics[1][0] = ratingIndigenousData;
        dataArray[foudnValue[0].id].ethnics[1][1] += 1;
    }
    if(ratingLGBTQData > 0){
        dataArray[foundValue[0].id].ethnics[2][0] = ratingLGBTQData;
        dataArray[foudnValue[0].id].ethnics[2][1] += 1;
    }
    saveSearch = formData.toLowerCase();
    sortAllLeaderBoard();
    console.log(formData);
    console.log(leaderBoard);
    res.render('business', { dataArray: dataArray, leaderBoard: leaderBoard, saveSearch});
});

app.get('/business', (req, res) => {
    res.render('business', { dataArray: dataArray, formData });
});

function getAutoCompleteList(inputSearch) {
    // Get input
    // inputSearch = document.getElementById("textbox").value();
    // fileNameList[100]; // request from SQL for list of all names
    inputSearch = inputSearch.toLowerCase();
    inputSearch = inputSearch.replace(/\s/g, "");
    // console.log(inputSearch);
    partialNamesList = [];
    for(let i = 0; i < namesList.length; i++){
        formattedName = namesList[i].toLowerCase();
        formattedName = formattedName.replace(/\s/g,"");
        // console.log(formattedName.substring(0,inputSearch.length));
        if(inputSearch == formattedName.substring(0,inputSearch.length)){
            // console.log(formattedName.substring(0,inputSearch.length));
            partialNamesList.push(namesList[i]);
        }
    }
    return partialNamesList;
}
function sortAllLeaderBoard(){
    const leaderBoardSize = 5;
    const ethnicSize = 3;
    leaderBoard = [];
    for (let i = 0; i < ethnicSize; i++){
        leaderBoard[i] = [];
        for(let j = 0; j < leaderBoardSize; j++){
            leaderBoard[i][j] = null;
        }
    } //2d array of all ethnicities and their leaderboards
    for(let leaderItr = 0; leaderItr < leaderBoardSize; leaderItr++){
        max_rating = [[null,null,null],[null,null,null],[null,null,null]]; //id, rating, and number of reviews
        for(let i = 0; i < dataArrayLen; i++){
            for(let j = 0; j < ethnicSize; j++){
                //check max rating against ethnic rating and reviews against max ethnic reviews
                // console.log("Comparing: ");
                // console.log(max_rating[j][1]);
                // console.log(" to ");
                // console.log(dataArray[i].ethnics[j][0]);
                if(max_rating[j][1] < dataArray[i].ethnics[j][0] && max_rating[j][2] < dataArray[i].ethnics[j][1]){
                    let inLeaderCheck = 0;
                    for(let k = 0; k < leaderItr; k++){
                        if(leaderBoard[j][k] != null && leaderBoard[j][k] == dataArray[i].id){
                            inLeaderCheck = 1
                        }
                    }
                    if(!inLeaderCheck){
                        max_rating[j][0] = dataArray[i].id; //set business id
                        max_rating[j][1] = dataArray[i].ethnics[j][0]; //set their rating
                        max_rating[j][2] = dataArray[i].ethnics[j][1]; //set their review
                    }
                }
            }
        }
        for(let j = 0; j < ethnicSize; j++){ //update to leaderboard
            if(max_rating[j][0] != null) leaderBoard[j][leaderItr] = max_rating[j][0];
        }
    }
    return leaderBoard;
}
// let buttonExists = document.querySelector(button.Button);
// if(buttonExists){
//     const button = document.addEventListener('click', (event) => {
//         event.preventDefault();
//         console.log("button clicked");
//         return "button clicked";
//     });
// }
module.exports = {
    getAutoCompleteList: getAutoCompleteList,
    sortAllLeaderBoard: sortAllLeaderBoard,
    // buttonCheck: buttonCheck
}
// // Route to render the EJS template with processed data
// app.get('/', (req, res) => {
//     res.render('index', { dataArray: dataArray ,
//                             getAutoCompleteList : getAutoCompleteList,
//                             sortAllLeaderBoard : sortAllLeaderBoard,
//                             buttonCheck : buttonCheck,
//                             message : 'Yo'});
//     // res.render('index', { getAutoCompleteList:getAutoCompleteList});
// });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
