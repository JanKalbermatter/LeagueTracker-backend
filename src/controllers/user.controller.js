exports.loggedIn = (_req, res) => {
    return res.status(200).send(true);
};
exports.isAdmin = (_req, res) => {
    return res.status(200).send(true);
};
exports.isModerator = (_req, res) => {
    return res.status(200).send(true);
};