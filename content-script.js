console.log('content script loaded')
let url = location.href; 


// When an element is clicked, this function will be executed
document.addEventListener("click", function(event) {
    const div = event.path.filter(path => path.className == "css-1dbjc4n r-1adg3ll r-1ny4l3l")
    // check if trend is clicked
    if (div.length > 0) {
      const trendName = div[0].children[0].children[0].children[0].children[1].innerText
      console.log(trendName)

      // Check if the trend is already displayed
      chrome.storage.session.get(["displayedTrend"]).then(async (result) => {
        // if no trend was displayed, display the trend
        console.log(result.displayedTrend)
        if (result.displayedTrend == null) {
          await fetch(`https://twitter-flask-372723.ue.r.appspot.com/articles?tag=${trendName}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            displayTLDR(trendName, data[0].summary, data[0].link);
          }).catch((err) => {
            console.log(err)
          });
        } else if (result.displayedTrend != trendName) {
            // if a new trend is clicked, display it
            await fetch(`https://twitter-flask-372723.ue.r.appspot.com/articles?tag=${trendName}`)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                removeTLDR()
                displayTLDR(trendName, data[0].summary, data[0].link);
              }).catch((err) => {
                console.log(err)
              });
            
          } 
      });
    }

    
});

function getSummary(trendName) {
  fetch(`https://twitter-flask-372723.ue.r.appspot.com/articles?tag=${trendName}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err)
    });
}

function displayTLDR(trendName, summary, link) {
  chrome.storage.session.set({ displayedTrend: trendName }).then(() => {
    console.log("Value is set to " + trendName);

    // create a div and add it to the page
    var div = document.createElement("div");
    div.style = "margin: 20px;"
    div.id = "twitter trend tldr"
    div.innerHTML = '<div dir="ltr" class="css-901oao css-cens5h r-jwli3a r-37j5jr r-1blvdjr r-1vr29t4 r-vrz42v r-hrzydr r-bcqeeo r-qvutc0" style="-webkit-line-clamp: 3;"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Twitter Trend TLDR: '+trendName+'</span></div>';
    div.innerHTML += '<div dir="auto" lang="en" class="css-901oao r-1nao33i r-37j5jr r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-bnwqim r-qvutc0" id="id__6y8ek7v84uf" data-testid="tweetText"><span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">'+summary+'</span></div>';
    document.getElementsByTagName("main")[0].prepend(div);
  });
}

function removeTLDR() {
  var div = document.getElementById("twitter trend tldr");
  if (div != null){
    div.remove();
  }
}


  // chrome.storage.session.set({ key: value }).then(() => {
  //   console.log("Value is set to " + value);
  // });
  
  // chrome.storage.session.get(["key"]).then((result) => {
  //   console.log("Value currently is " + result.key);
  // });