// userControllerHelper.js
const prisma = require('../index');

const getUser = async (name) => {
    const user = await prisma.user.findFirst({ // notice "user", not "users"
        where: { userName: name }
    });
    return user;
}

const getUserById = async (id) => {
    const user = await prisma.user.findFirst({
        where: { id: id }
    });
    return user;
}

module.exports = { getUser, getUserById };
