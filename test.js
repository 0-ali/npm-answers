var answer = require('./index');
new answer({q:'who is the owner of google', limit:2},function(res){
   for(var r in res ){
       console.log(res[r].answer);
   }
});