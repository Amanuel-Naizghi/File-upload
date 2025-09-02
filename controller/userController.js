const prisma = require('../index');

const postAddUser = async (req,res) => {
    const {userName,password} = req.body;
    try{
        const user = await prisma.users.create({
            data:{userName,password}
        })
    }catch (error) {
        res.status(500).json({error: error.message})
    }finally{
        prisma.$disconnect();
    }

    const findAllUsers = await prisma.users.findMany();
    console.log(`All users are here men`, findAllUsers);
}

module.exports = {postAddUser}