import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { getFeedHtml } from "./utils.js";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.delete) {
    handleDeleteBtnClick(e.target.dataset.delete);
  } else if (e.target.id === "reply-btn") {
    handleReplyBtnClick(e.target.dataset.replybtn);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.find(function (tweet) {
    return tweet.uuid === tweetId;
  });

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.find(function (tweet) {
    return tweet.uuid === tweetId;
  });

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleReplyBtnClick(uuid) {
  const replyInput = document.getElementById(`comment-${uuid}`);
  console.log(replyInput.value);

  const tweetReplyObj = {
    handle: `@TSMFanboy`,
    profilePic: `images/codeninja.jpg`,
    tweetText: replyInput.value,
  };

  if (replyInput.value !== "") {
    tweetsData.forEach(function (tweet) {
      if (tweet.uuid === `${uuid}`) {
        tweet.replies.push(tweetReplyObj);
      }
    });
  }

  render();
}

function handleDeleteBtnClick(tweetId) {
  const targetTweetObj = tweetsData.find(function (tweet) {
    return tweet.uuid === tweetId;
  });

  const removeTargetTweetObj = tweetsData.findIndex(
    (item) => item.uuid === tweetId
  );
  tweetsData.splice(removeTargetTweetObj, 1);

  render();
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@TSMFanboy`,
      profilePic: `images/codeninja.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      hasDeleteBtn: true,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
