let dataArray = []

function loadCSV(){
    fetch('city_database.csv')
    .then(response => response.text())
    .then(res => {
        dataArray = res.split('\n').map(item => item.split(','))
    })
    .catch(error => console.log("error", error))
}

window.onload = function(){
    loadCSV();
}

function search(){
    let searchValue = document.getElementById('searchDiv').value.toLowerCase();
    let foundValue = dataArray.filter(row => row.some(column => column.toLowerCase().includes(searchValue)));

    let html = '';
    foundValue.forEach(row => {
        
        html += '<tr>';
        row.forEach(column => {
            html += `<td>${column}</td>`
            console.log(column)
        })
        html += '</tr>'
    })

    document.getElementById('tableView').innerHTML = html;
}

function tt(){

const formData = document.getElementById('reviewSubmit')
const reviewsWritten = document.getElementById('getReviews')

formData.addEventListener('submit', function(event){
    event.preventDefault();
    const review = reviewsWritten.value;
    console.log(review);
})
}
