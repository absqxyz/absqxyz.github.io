
var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEitq0DbAAwoL9e0uEUjfPJmf4tt-wSuBQAEMw',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

let urlParams = new URLSearchParams(window.location.search);
let id = ""


client.query(
    q.Get(
      q.Match(q.Index('email_by_name'), localStorage.getItem("absqMailName"))
    )
  )
        
  .then(function(ret) {

    if(localStorage.getItem("absqMailPassword") != ret.data.password)
    {
       alert(1)
    }

    document.title = `[` + ret.data.recieved_mail.length + `] ` + ret.data.name + `@absq.xyz`
    document.getElementById("mailCount").innerHTML = `Your Inbox [<a id="count">` + ret.data.recieved_mail.length + `</a>]`
    id = ret.ref.value.id
    var docRef = q.Ref(q.Collection('emails'), id)

function report(e) {
  console.log(e)
  let mail = ""
  document.title = `[` + e.data.recieved_mail.length + `] ` + e.data.name + `@absq.xyz`
  document.getElementById("count").innerHTML = e.data.recieved_mail.length
  e.data.recieved_mail.reverse()
    for (let i = 0; i < e.data.recieved_mail.length; i++) {
        mail += `<div><label><b>` + e.data.recieved_mail[i].from + `@absq.xyz </b></label><label style="float:right">` + e.data.recieved_mail[i].timestamp + ` [` + calcDate(e.data.recieved_mail[i].timestamp) + `]</label><br><br>` + e.data.recieved_mail[i].content.replace(/\n/g, "<br>") + `</div><br><hr><br>`
    }
    document.getElementById("mail").innerHTML = `<hr><br>` + mail
  var data = ('action' in e)
    ? e["document"].data
    : e.data
  
  
}

var stream
const startStream = () => {
  stream = client.stream.document(docRef)
  .on('snapshot', snapshot => {
    report(snapshot)
  })
  .on('version', version => {
    report(version)
  })
  .on('error', error => {
    console.log('Error:', error)
    stream.close()
    setTimeout(startStream, 1000)
  })
  .start()
}

startStream()


})
      .catch(function(e){
         window.location.href = "account.html"
      });



      function calcDate(date)
    {
dateNow = new Date();
dateThen = new Date(date);
const diffTime = Math.abs(dateThen - dateNow);
let seconds = Math.round(diffTime / 1000)
let minutes = Math.round(diffTime / 1000 / 60)
let hours =  Math.round(diffTime / 1000 / 60 / 60)
let days = Math.round(diffTime / 1000 / 60 / 60 / 24)
let years = Math.round(diffTime / 1000 / 60 / 60 / 24 / 365)

        
       if(seconds >= 1 && seconds < 60){
        if(seconds == 1)
        {
          return seconds + " second ago"
        }
        else{
          return seconds + " seconds ago"
        }
}
else if(minutes >= 1 && minutes < 60){
  if(minutes== 1)
  {
    return minutes + " minute ago"
  }
  else{
    return minutes + " minutes ago"
  }
}
else if(hours >= 1 && hours < 24){
  if(hours == 1)
  {
    return hours + " hour ago"
  }
  else{
    return hours + " hours ago"
  }
}
else if(days >= 1 && days < 365){
  if(days == 1)
  {
    return days + " day ago"
  }
  else{
    return days + " days ago"
  }
}
else if(years >= 1){
  if(years == 1)
  {
    return years + " year ago"
  }
  else{
    return years + " years ago"
  }
}
        
    }


    function sendMail(){

        let date = new Date()
        if(document.getElementById("recipient").value == "" || document.getElementById("content").value == ""){
            alert("Please fill out all fields!")
    
        }
        else{
        client.query(
            q.Get(
              q.Match(q.Index('email_by_name'), document.getElementById("recipient").value)
            )
          )
          .then(function(ret){ 
               
            let recieved_mail = ret.data.recieved_mail
            recieved_mail.push({from:  localStorage.getItem("absqMailName"), timestamp: date.toUTCString(), content: document.getElementById("content").value})
            client.query(
              q.Update(q.Ref(q.Collection("emails"), ret.ref.value.id), {
              data: {
                recieved_mail: recieved_mail
      
              },
              })
              ).then(function(ret){ 
              
                alert("Mail sent!")
    
              }).catch(function(e){

                alert("Something went wrong. " + e)
              })
          
          })
            
          .catch(function(e){
          
          alert("Recipient does not exist!")
          
          });
        }


}


function logOut(){

    localStorage.removeItem('absqMailName');
    localStorage.removeItem('absqMailPassword');
    window.location.href = "account.html"
}

function clearInbox(){

    client.query(
        q.Get(
          q.Match(q.Index('email_by_name'), localStorage.getItem("absqMailName"))
        )
      )
      .then(function(ret){ 
           
        client.query(
          q.Update(q.Ref(q.Collection("emails"), ret.ref.value.id), {
          data: {
            recieved_mail: []
  
          },
          })
          ).then(function(ret){ 
          
            alert("Inbox cleared!")

          }).catch(function(e){

            alert("Something went wrong. " + e)
          })
      
      })
        
      .catch(function(e){
      
        alert("Something went wrong. " + e)
      
      });
}