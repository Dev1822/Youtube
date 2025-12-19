const homeVideos = document.querySelector(".homevideos");
const search = document.querySelector(".input");
const autoCompleteDisplay = document.querySelector(".autocomplete");
var resultArr = []
const searchbtn = document.querySelector(".search-btn");
const autoOptions = document.getElementsByClassName("auto");
var videoCards = []
var temp;

function countDisplay(countstr){
    let count=parseInt(countstr);
    if(1000<=count && count<1000000){
        countstr=`${parseInt(count/1000)} k`
    }
    else if(1000000<=count && count<1000000000){
        countstr=`${parseInt(count/1000000)} m`
    }
    else if(1000000000<=count && count<1000000000000){
        countstr=`${parseInt(count/1000000000)} b`
    }
    return countstr;
}

function loadVideos(datas) {
    let results = datas.data;
    videoCards = [];
    homeVideos.innerHTML = "";

    results.forEach(result => {
        try {
            let channel_id = result.videoId;
            let thumbnail = result.thumbnail[1].url;
            let owner = result.channelTitle;
            let vidtitle = result.title;
            let views = countDisplay(result.viewCount);
            let published = result.publishedTimeText;

            let a = document.createElement("a");
            a.href = "pages/video/video.html";
            a.id = channel_id;

            a.innerHTML = `
                <div class="video-card">
                    <div class="thumbnail">
                        <img src="${thumbnail}" alt="thumbnail">
                    </div>
                    <div class="info">
                        <img class="channel-img"
                            src="https://res.cloudinary.com/dre3wdpfu/image/upload/v1759150451/Ellipse_4-1_jxnsgv.png">
                        <div class="meta">
                            <h3>${vidtitle}</h3>
                            <p>${owner}</p>
                            <p>${views} views · ${published}</p>
                        </div>
                        <div class="more">⋮</div>
                    </div>
                </div>
            `;

            homeVideos.appendChild(a);
            videoCards.push(a);

        } catch (error) {
            console.log(error);
        }
    });

    videoCards.forEach(card => {
        card.addEventListener("click",()=>{
            sessionStorage.setItem("videoId",card.id)
        })
    });
}


function loadHome() {
    showLoading();
    // fetch("https://yt-api.p.rapidapi.com/trending?geo=US&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb")
    //     .then((response) => response.json())
    //     .then((datas) => loadVideos(datas))
    //     .catch((error) => console.log(error));
}

loadHome();

function autoComplete(auto) {
    let autoResults = auto.suggestions;
    let texts = "";
    resultArr = [];
    autoResults.forEach(x => {

        let result = `<p class="auto">${x}</p>`
        texts += result
        resultArr.push(result);
    });
    autoCompleteDisplay.innerHTML = texts;
    for (let i = 0; i < autoOptions.length; i++) {
        let autoOption = autoOptions[i];
        autoOption.addEventListener("click", () => {
            fetch(`https://yt-api.p.rapidapi.com/search?query=${autoOption.textContent}&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb`)
                .then((response) => response.json())
                .then((datas) => displaySearch(datas));
        })
    }
}

search.addEventListener("input", () => {
    setTimeout(() => {
        let text = search.value;
        if (text == "") {
            autoCompleteDisplay.innerHTML = "";
            return;
        }
        let checkLocal = localStorage.getItem(text);
        if (checkLocal != null) {
            autoComplete(JSON.parse(checkLocal));
        }
        else {
            fetch(`https://yt-api.p.rapidapi.com/suggest_queries?query=${text}&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb`)
                .then(response => response.json())
                .then((auto) => {
                    localStorage.setItem(text, JSON.stringify(auto));
                    autoComplete(auto);
                });
        }
    }, 1000)
});

function displaySearch(datas) {
    autoCompleteDisplay.innerHTML = "";
    homeVideos.innerHTML = "";
    loadVideos(datas);
}

search.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        let query = search.value;
        fetch(`https://yt-api.p.rapidapi.com/search?query=${query}&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb`)
            .then((response) => response.json())
            .then((datas) => displaySearch(datas));
    }
})

searchbtn.addEventListener("click", () => {
    let query = search.value;
    fetch(`https://yt-api.p.rapidapi.com/search?query=${query}&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb`)
        .then((response) => response.json())
        .then((datas) => displaySearch(datas));
})

function showLoading() {
    homeVideos.innerHTML = `
      
        ${'<div class="skeleton-card"></div>'.repeat(12)}
      
    `;
}
