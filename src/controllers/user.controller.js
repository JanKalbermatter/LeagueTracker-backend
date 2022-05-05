exports.loggedIn = (req, res) => {
    return res.status(200).send(true);
};
exports.isAdmin = (req, res) => {
    return res.status(200).send(true);
};
exports.isModerator = (req, res) => {
    return res.status(200).send(true);
};