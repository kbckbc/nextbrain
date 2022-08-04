module.exports = {
  prettyData: function (data) {
    // console.log('tools', 'prettydata', data);

    let sortbyNameAscend = data.slice().sort((a, b) => (a.user - b.user));
    let sortbyScoreDescend = sortbyNameAscend.slice().sort((a, b) => b.score - a.score);
  
    let newData = [];
    let rank = 1;
    //console.log('scoreArr', scoreArr);  
    for( let i in sortbyScoreDescend ) {
      let row = sortbyScoreDescend[i];
      let date = new Date(row.timestamp).toUTCString(); 
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
      console.log('tools', 'newData', newData);

    return newData;
  }
};