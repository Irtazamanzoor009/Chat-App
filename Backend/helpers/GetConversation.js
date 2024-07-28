const { ConversationModel } = require("../Models/ConversationModel");

const GetConversation = async (CurrentUserId) => {
  if (CurrentUserId) {
    const CurrentUserConversations = await ConversationModel.find({
      $or: [{ sender: CurrentUserId },{ receiver: CurrentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    // console.log("Current User Conversation", CurrentUserConversations);

    const ConversationPayload = CurrentUserConversations.map((Convmsg) => {
      const CountUnSeenMsg = Convmsg.messages.reduce((prev, curr) => {
        if (curr?.msgByUserId.toString() !== CurrentUserId) {
          return prev + (curr.seen ? 0 : 1);
        }
        else
        {
            return prev
        }
      }, 0);

      return {
        _id: Convmsg?._id,
        sender: Convmsg?.sender,
        receiver: Convmsg?.receiver,
        UnseenMsg: CountUnSeenMsg,
        lastMsg: Convmsg.messages[Convmsg?.messages?.length - 1],
      };
    });

    return ConversationPayload;
  } else {
    return [];
  }
};





  
  module.exports = GetConversation;
  