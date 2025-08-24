const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns")
const ConnectionRequestModel = require("../models/connectionRequest");
const { run: sendEmail } = require("./sendEmail");


cron.schedule("0 8 * * *", async () => {
    // send email to all the people who fot requests the previous day 

    const yesterday = subDays(new Date(), 1);
    const yesterdayStartOfDay = startOfDay(yesterday)
    const yesterdayEndOfDay = endOfDay(yesterday)

    try {
        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStartOfDay,
                $lt: yesterdayEndOfDay
            }
        }).populate("senderId receiverId")

        const listOfEmails = [...new Set(pendingRequests.map((req) => req.receiverId.email))];


        for (const email of listOfEmails) {
            // send emails 
            try {
                await sendEmail(
                    email,
                    "You Have New Connection Requests on LinkUp 🔔",
                    `Hi there,  

        You received new connection requests yesterday on LinkUp.  
        Log in today to see who’s interested in connecting with you!  

        👉 Start connecting: https://vikasrajput18.com/  

        Stay awesome,  
        Team LinkUp`
                );


            } catch (error) {
                console.error(error)
            }
        }


    } catch (error) {
        console.error(error)
    }
})