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

const getDirectory = async (folder) => {
    let currentDirectory = folder;
    const directoryArray = ['root'];
    console.log(`Folder`, currentDirectory);
    let id = currentDirectory.id;
    while(currentDirectory.parentId){
        directoryArray.unshift(currentDirectory.name);
        const item = await prisma.folder.findUnique({
            where: {id:currentDirectory.parentId},
            include: {children: true, files: true},
        });
        console.log(`Item to be added:`, item.id);
        console.log(`Directory array`, directoryArray);
        currentDirectory = item;
        id = currentDirectory.id;
    }
    directoryArray.unshift(currentDirectory.name);
    let root = directoryArray.pop();//Removing the last item of the directory array which is the root file and moving it to index 0
    directoryArray.unshift(root);

    return directoryArray;

}

const extractIdFromDirectory = async (array) => {
    const directoryArray = [];
    array.forEach(async (item) => {
        const id = await prisma.folder.findMany({
            where:{name:item}
        });
    })

    return directoryArray;
}

module.exports = { getUser, getUserById, getUserDataById, getDirectory };
