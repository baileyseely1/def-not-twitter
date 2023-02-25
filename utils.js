import { tweetsData } from "./data.js";

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    let repliesHtml = "";
    let deleteBtn = "";
    let retweetIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    if (tweet.hasDeleteBtn) {
      deleteBtn += `
            <button class="delete-btn">
            <i class="fa-solid fa-trash-can" data-delete="${tweet.uuid}"></i>
            </button> 
            `;
    }

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                        `;
      });
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
                `;
  });
  return feedHtml;
}

export { getFeedHtml };
