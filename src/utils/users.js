const users=[]

const addUser=({id,username,room})=>{
    //Clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //Validate the data
    if(!username||!room){
        return{
            error:'Username and room are required!'
        }
    }

    //Check for exisiting user
    const exisitingUser=users.find((user)=>{
        return user.room===room&&user.username===username
    })
    //validate username
    if(exisitingUser){
        return{
            error:'Username is in use!'
        }
    }
    //store user
    const user={id,username,room}
    users.push(user)
    return{user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

        if(index!==-1){
            return users.splice(index,1)[0]
        }
}
const getUser=(id)=>{
    var userOne=null
     const index=users.findIndex((user)=>{
         if(user.id!==id){
             return userOne=undefined
         }
                return userOne=user
    })
    return userOne
}
const getUsersInRoom=(room)=>{
    var allUsers=[]
    users.forEach((user)=>{
        if(user.room===room){
           allUsers.push(user)
        }
    })
return allUsers
}
module.exports={
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}