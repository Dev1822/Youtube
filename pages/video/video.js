const videoId = sessionStorage.getItem("videoId");
const video = document.querySelector(".video");

video.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
const videoTitle = document.querySelector(".video-title");
const channelName = document.querySelector(".channel-name");
const like = document.querySelector(".like");
const desStats = document.querySelector(".desstats");
const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];
const descriptionDisplay = document.querySelector(".description");
const infoTitle = document.querySelector(".info-title");
const related = document.querySelector(".related");

var videoCards = []


//left : profile pic, subs, verification tick

function countDisplay(countstr) {
    let count = parseInt(countstr);
    if (1000 <= count && count < 1000000) {
        countstr = `${parseInt(count / 1000)} k`
    }
    else if (1000000 <= count && count < 1000000000) {
        countstr = `${parseInt(count / 1000000)} m`
    }
    else if (1000000000 <= count && count < 1000000000000) {
        countstr = `${parseInt(count / 1000000000)} b`
    }
    return countstr;
}

function dateFormat(inputDate) {
    let date = inputDate.split("T")[0];
    let datearr = date.split("-");
    return `${datearr[2]} ${months[datearr[1] - 1]} ${datearr[0]}`
}

function showVideo(data) {
    videoTitle.textContent = data.title;
    channelName.textContent = data.channelTitle;
    let likes = countDisplay(data.likeCount)
    let liketxt = `<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJtMjAuOTc1IDEyLjE4NWwtLjczOS0uMTI4em0tLjcwNSA0LjA4bC0uNzQtLjEyOHpNNi45MzggMjAuNDc3bC0uNzQ3LjA2NXptLS44MTItOS4zOTNsLjc0Ny0uMDY0em03Ljg2OS01Ljg2M2wuNzQuMTIyem0tLjY2MyA0LjA0NWwuNzQuMTIxem0tNi42MzQuNDExbC0uNDktLjU2OHptMS40MzktMS4yNGwuNDkuNTY5em0yLjM4MS0zLjY1M2wtLjcyNi0uMTg5em0uNDc2LTEuODM0bC43MjYuMTg4em0xLjY3NC0uODg2bC0uMjMuNzE0em0uMTQ1LjA0N2wuMjI5LS43MTR6TTkuODYyIDYuNDYzbC42NjIuMzUzem00LjA0My0zLjIxNWwtLjcyNi4xODh6bS0yLjIzLTEuMTE2bC0uMzI2LS42NzV6TTMuOTcxIDIxLjQ3MWwtLjc0OC4wNjR6TTMgMTAuMjM0bC43NDctLjA2NGEuNzUuNzUgMCAwIDAtMS40OTcuMDY0em0xNy4yMzYgMS44MjNsLS43MDUgNC4wOGwxLjQ3OC4yNTZsLjcwNS00LjA4em0tNi45OTEgOS4xOTNIOC41OTZ2MS41aDQuNjQ5em0tNS41Ni0uODM3bC0uODEyLTkuMzkzbC0xLjQ5NS4xMjlsLjgxMyA5LjM5M3ptMTEuODQ2LTQuMjc2Yy0uNTA3IDIuOTMtMy4xNSA1LjExMy02LjI4NiA1LjExM3YxLjVjMy44MjYgMCA3LjEyNi0yLjY2OSA3Ljc2NC02LjM1N3pNMTMuMjU1IDUuMWwtLjY2MyA0LjA0NWwxLjQ4LjI0MmwuNjYzLTQuMDQ0em0tNi4wNjcgNS4xNDZsMS40MzgtMS4yNGwtLjk3OS0xLjEzNkw2LjIxIDkuMTF6bTQuMDU2LTUuMjc0bC40NzYtMS44MzRsLTEuNDUyLS4zNzZsLS40NzYgMS44MzN6bTEuMTk0LTIuMTk0bC4xNDUuMDQ3bC40NTktMS40MjhsLS4xNDUtLjA0N3ptLTEuOTE1IDQuMDM4YTguNCA4LjQgMCAwIDAgLjcyMS0xLjg0NGwtMS40NTItLjM3N0E3IDcgMCAwIDEgOS4yIDYuMTF6bTIuMDYtMy45OTFhLjg5Ljg5IDAgMCAxIC41OTYuNjFsMS40NTItLjM3NmEyLjM4IDIuMzggMCAwIDAtMS41ODktMS42NjJ6bS0uODYzLjMxM2EuNTIuNTIgMCAwIDEgLjI4LS4zM2wtLjY1MS0xLjM1MWMtLjUzMi4yNTYtLjkzMi43My0xLjA4MSAxLjMwNXptLjI4LS4zM2EuNi42IDAgMCAxIC40MzgtLjAzbC40NTktMS40MjhhMi4xIDIuMSAwIDAgMC0xLjU0OC4xMDd6bTIuMTU0IDguMTc2aDUuMTh2LTEuNWgtNS4xOHpNNC43MTkgMjEuNDA2TDMuNzQ3IDEwLjE3bC0xLjQ5NC4xMjlsLjk3MSAxMS4yMzZ6bS0uOTY5LjEwN1YxMC4yMzRoLTEuNXYxMS4yNzl6bS0uNTI2LjAyMmEuMjYzLjI2MyAwIDAgMSAuMjYzLS4yODV2MS41Yy43MjYgMCAxLjI5NC0uNjIyIDEuMjMyLTEuMzQ0ek0xNC43MzUgNS4zNDNhNS41IDUuNSAwIDAgMC0uMTA0LTIuMjg0bC0xLjQ1Mi4zNzdhNCA0IDAgMCAxIC4wNzYgMS42NjR6TTguNTk2IDIxLjI1YS45MTYuOTE2IDAgMCAxLS45MTEtLjgzN2wtMS40OTQuMTI5YTIuNDE2IDIuNDE2IDAgMCAwIDIuNDA1IDIuMjA4em0uMDMtMTIuMjQ0Yy42OC0uNTg2IDEuNDEzLTEuMjgzIDEuODk4LTIuMTlMOS4yIDYuMTA5Yy0uMzQ2LjY0OS0uODk3IDEuMTk2LTEuNTUzIDEuNzZ6bTEzLjA4OCAzLjMwN2EyLjQxNiAyLjQxNiAwIDAgMC0yLjM4LTIuODI5djEuNWMuNTY3IDAgMSAuNTEyLjkwMiAxLjA3M3pNMy40ODcgMjEuMjVjLjE0NiAwIC4yNjMuMTE4LjI2My4yNjNoLTEuNWMwIC42ODIuNTUzIDEuMjM3IDEuMjM3IDEuMjM3em05LjEwNS0xMi4xMDVhMS41ODMgMS41ODMgMCAwIDAgMS41NjIgMS44NHYtMS41YS4wODMuMDgzIDAgMCAxLS4wODItLjA5OHptLTUuNzIgMS44NzVhLjkyLjkyIDAgMCAxIC4zMTYtLjc3NGwtLjk4LTEuMTM3YTIuNDIgMi40MiAwIDAgMC0uODMgMi4wNHoiLz48L3N2Zz4=" alt=""> ${likes} `
    like.innerHTML = liketxt;
    let desStatstxt = `${data.viewCount} views ${data.publishDate} <span class="destitle">${data.title}</span>`;
    desStats.innerHTML = desStatstxt;
    descriptionDisplay.textContent = data.description;
    infoTitle.textContent = data.title;
    relatedVidsLoad();
}

function relatedVids(datas) {
    showLoading();
    let results = datas.data;
    related.innerHTML="";
    videoCards=[]
    for (let i = 0; i < 6; i++) {
        let result=results[i]
        try {
            let video_Id = result.videoId;
            let thumbnail = result.thumbnail[1].url;
            let duration=result.lengthText;
            let owner = result.channelTitle;
            let vidtitle = result.title;
            let views = countDisplay(result.viewCount);
            let published = result.publishedTimeText;

            let a = document.createElement("a");
            a.href = "video.html";
            a.id = video_Id;

            a.innerHTML = `
            <div class="video-card">
                <div class="card-thumbnail">
                    <img src="${thumbnail}" alt="">
                    <span class="duration">${duration}</span>
                </div>

                <div class="video-info">
                    <p class="title">${vidtitle}</p>
                    <p class="channel">${owner}</p>
                    <p class="meta">${views} views · ${published}</p>
                </div>
            </div>
            `;

            related.appendChild(a);
            videoCards.push(a);
        } catch (error) {
            console.log(error);
        }
    }
    videoCards.forEach(card => {
        card.addEventListener("click",()=>{
            sessionStorage.setItem("videoId",card.id)
        })
    });
}

function relatedVidsLoad(){
    showLoading();
    fetch(`https://yt-api.p.rapidapi.com/related?id=${videoId}&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb`)
    .then((response)=>response.json())
    .then((datas)=>relatedVids(datas))
}

fetch(`https://yt-api.p.rapidapi.com/video/info?id=${videoId}&rapidapi-key=ba15572616mshe02af4d9e2b14a3p19a442jsn543a7ad8ebeb`)
    .then((response => response.json()))
    .then((data) => showVideo(data))

function showLoading() {
    related.innerHTML = `
        ${'<div class="skeleton-card"></div>'.repeat(3)}
    `;
}





