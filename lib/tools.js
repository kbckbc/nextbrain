module.exports = {
  prettyData: function (data) {
    let newData = [];
    let rank = 1;
    //console.log('scoreArr', scoreArr);  
    for( let i in data ) {
      let row = data[i];
      let date = new Date(row.timestamp).toISOString().split('T')[0];
      let name = row.user;
      let school = row.school;
      let score = row.score;
      let hit = row.hit;
      let wrong = row.wrong;
      
      name = name.charAt(0).toUpperCase() + name.slice(1);
      school = school.charAt(0).toUpperCase() + school.slice(1);
  
      newData.push({rank, name, school, date, score, hit, wrong});
  
      rank++;      
    }
      // console.log('tools', 'newData', newData);

    return newData;
  }
};