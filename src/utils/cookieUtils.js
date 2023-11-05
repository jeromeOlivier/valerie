// const cookie = require("node:cookie");

function updateCookie(cookie, title, type) {
    const existingItemIndex = cookie.findIndex(item => item.title === title && item.type === type);
    if (existingItemIndex !== -1) {
        return cookie[existingItemIndex].quantity += 1;
    } else {
        return cookie.push({ title: title, type: type, quantity: 1 });
    }
}

module.exports = {
    updateCookie,
};