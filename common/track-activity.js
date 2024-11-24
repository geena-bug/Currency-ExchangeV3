const trackActivity = ({req, action}) => {
    // Check if the user is authenticated
    if(!req.user){
        return
    }
    // Get the activities from the session or initialize an empty array
    const activities = req.session?.activities ?? []
    // Add the new activity to the activities array
    activities.push({
        userId: req.user.id,
        action,
        timestamp: new Date()
    });
    // Update the activities in the session
    req.session.activities = activities
}
module.exports = {
    trackActivity
}