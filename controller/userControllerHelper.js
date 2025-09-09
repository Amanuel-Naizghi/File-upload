// userControllerHelper.js
const prisma = require('../index');

const getUser = async (name) => {
    const user = await prisma.user.findUnique({ 
        where: { userName: name }
    });
    return user;
}

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {id:id}
    })

    return user;
}

const getUserDataById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
            files: true,
            folders: {
                include: {
                    files: true,
                    children:{
                        include:{
                            files:true
                        }
                    }
                }
            }
        },
    });

    return user;
}

module.exports = { getUser, getUserById, getUserDataById };
