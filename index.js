import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const localTweets = JSON.parse(localStorage.getItem('tweets'))

let allTweets = tweetsData

if (localTweets) {
    allTweets = localTweets
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } 
    else if(e.target.dataset.delete) {
        handleDeleteBtnClick(e.target.dataset.delete)
    }
    
    else if(e.target.id === 'reply-btn') {
        handleReplyBtnClick(e.target.dataset.replybtn)
    }

})

function handleLikeClick(tweetId){ 
    const targetTweetObj = allTweets.find(function(tweet){
        return tweet.uuid === tweetId
    })

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = allTweets.find(function(tweet){
        return tweet.uuid === tweetId
    })
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
}

function handleReplyBtnClick(uuid) {
    const replyInput = document.getElementById(`comment-${uuid}`)
    
    if (replyInput.value) {
    allTweets.forEach(function(tweet){
        if(tweet.uuid === `${uuid}`) { 
        tweet.replies.unshift({
            handle: `@TSMFanboy`,
            profilePic: `images/codeninja.jpg`,
            tweetText: replyInput.value,
        })
        }
    })
    
    }

    render()

}

function handleDeleteBtnClick(tweetId) {
    const targetTweetObj = allTweets.find(function(tweet){
        return tweet.uuid === tweetId
    })

    const removeTargetTweetObj = allTweets.findIndex(item => item.uuid === tweetId)
 allTweets.splice(removeTargetTweetObj, 1)
    saveToLocalStorage()
    render()    
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){

        const newTweet = 
        {
            handle: `@TSMFanboy`,
            profilePic: `images/codeninja.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            hasDeleteBtn: true,
            uuid: uuidv4()
         }

        allTweets.unshift(newTweet)
    render()
    tweetInput.value = ''
    }

}


function getFeedHtml(){
    let feedHtml = ``
    
    allTweets.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let deleteBtn = ''
 
        if (tweet.hasDeleteBtn) {
            deleteBtn += `
            <button class="delete-btn">
            <i class="fa-solid fa-trash-can" data-delete="${tweet.uuid}"></i>
            </button> 
            `
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div class="pos-relative">
            <p class="handle">${tweet.handle}</p>
            ${deleteBtn}
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
    <div class="tweet-reply-area">
    <img src="images/codeninja.jpg" class="profile-pic">
    <textarea class="reply-area" placeholder="Reply to ${tweet.handle}" id="comment-${tweet.uuid}"></textarea>
    </div>
    <button class="tweet-btn" id="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    localStorage.setItem('tweets', JSON.stringify(allTweets));
}

render()


