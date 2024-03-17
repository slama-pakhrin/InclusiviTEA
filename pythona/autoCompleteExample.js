function getAutoCompleteList() {
    // Get input
    inputSearch = document.getElementById("textbox").value();

    fileNameList[100]; // request from SQL for list of all names

    inputSearch = "Hello GAamers";
    inputSearch.toLowerCase();
    inputSearch.replace(/\s/g, "");
    console.log(inputSearch);

    partialNamesList = [];
    for(let i = 0; i < fileNameList.length; i++){
        formattedName = fileNameList[i].toLowerCase();
        formattedName.replace(/\s/g,"");

        if(inputSearch == fileNameList[i].substring(0,inputSearch.length - 1)){
            partialNamesList.append(fileNameList[i]);
        }
    }

    return partialNamesList;    
}

// Call the incrementCounter function every second
setInterval(incrementCounter, 1000);