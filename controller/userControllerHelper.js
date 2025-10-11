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
    const directoryArray = [{name:'root',id:0}];
    //console.log(`Folder`, currentDirectory);
    let id = currentDirectory.id;
    while(currentDirectory.parentId){
        const itemToAdd = {name:currentDirectory.name,id:currentDirectory.id}
        directoryArray.unshift(itemToAdd);
        const item = await prisma.folder.findUnique({
            where: {id:currentDirectory.parentId},
            include: {children: true, files: true},
        });
        // console.log(`Item to be added:`, item.id);
        // console.log(`Directory array`, directoryArray);
        currentDirectory = item;
        id = currentDirectory.id;
    }
    directoryArray.unshift({name:currentDirectory.name,id:currentDirectory.id});//Adding the parent folder manually since it does't have a parent above it
    let root = directoryArray.pop();//Removing the last item of the directory array which is the root file and moving it to index 0
    directoryArray.unshift(root);

    return directoryArray;

}

const extractIdFromDirectory = async (array) => {
    const directoryIdArray = [];
    array.forEach(async (item) => {
        const id = await prisma.folder.findMany({
            where:{name:item},
            include: {children: true, files: true},
        });
        console.log(`items of id are `,id);
    })

    return directoryIdArray;
}

module.exports = { getUser, getUserById, getUserDataById, getDirectory, extractIdFromDirectory };
