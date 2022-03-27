var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEitq0DbAAwoL9e0uEUjfPJmf4tt-wSuBQAEMw',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

function signUp(){

    if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
    {
        alert("Please fill out all credentials!")
    }
    else{
    client.query(
        q.Get(
          q.Match(q.Index('email_by_name'), document.getElementById("username").value)
        )
      )
      .then(function(ret){ 
           
      alert("This name is taken!")
      
      })
        
      .catch(function(e){
      
      
      
        let date = new Date();
          client.query(
        q.Create(
          q.Collection('emails'),
          { data: { name: document.getElementById("username").value.replace(/\s/g, ""), password: document.getElementById("password").value, recieved_mail: []} },
        )
      )
      .then(function(ret){
      
        localStorage.setItem('absqMailName', ret.data.name);
    localStorage.setItem('absqMailPassword', ret.data.password);
 window.location.href = "inbox.html"

          }).catch(function(e){
              alert("Something went wrong. " + e)
          })
      
      });
    }

}

function logIn(){

    if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
    {
        alert("Please fill out all credentials!")
    }
    else{

    client.query(
        q.Get(
          q.Match(q.Index('email_by_name'), document.getElementById("username").value)
        )
      )
            
      .then(function(ret) {
                            
        if(ret.data.password != document.getElementById("password").value)  
        {
          alert("User and password do not match!")
        }
        else{
         
          
        localStorage.setItem('absqMailName', ret.data.name);
        localStorage.setItem('absqMailPassword', ret.data.password);
     window.location.href = "inbox.html"

        }
      })
      .catch(function(e){
        alert("User not found.")
      });
    }


}