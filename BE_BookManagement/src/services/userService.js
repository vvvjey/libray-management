import db from "../models/index"
import bcrypt from "bcryptjs"

let hashUserPassword = async (password) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        let hashPassword = await bcrypt.hashSync(password, salt)
        return hashPassword
    }
    catch (e) {
        console.log(e);
        throw Error(e)
    }
}

let checkUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { username: username }
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}
let handleUserLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let users = await checkUsername(username)
            if (users) {
                // User already exists

                let user = await db.User.findOne({
                    where: { username: username },
                    attributes: ['username', 'password', 'id', 'email', 'name', 'address', 'gender', 'role', 'phonenumber', 'image'],
                    raw: true
                })
                if (user) {
                    // compare password use bcrypt
                    // let check = 1 await bcrypt.compareSync(password, user.password)
                    let check;
                    if (user.password === password) {
                        check = 1;
                    }
                    else {
                        check = 0;
                    }
                    if (check) {

                        userData.errCode = 0
                        userData.errMessage = "Login success";
                        userData.user = users
                    }
                    else {
                        userData.errCode = 1;
                        userData.errMessage = "Wrong password!";
                    }
                }
                else {
                    userData.errCode = 1;
                    userData.errMessage = `Your username isn's exists in our system. Please try again!`;
                }
            }
            resolve(userData);

        }
        catch (e) {
            reject(e);
        }
    })
}

// 
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.username || !data.password || !data.role) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing reuqired parameters."
                })
            }
            let check = await checkUsername(data.username)
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your username already in used, plz try another username."
                })
            } else {
                await db.User.create({
                    name: data.name,
                    gender: data.gender,
                    role: data.role,
                    phonenumber: data.phonenumber,
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    address: data.address,
                    image: data.image,
                    birthDay: data.birthDay,
                    startWork: data.startWork,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create a new user success.'

                })
            }
        } catch (e) {
            resolve({
                errCode: 0,
                errMessage: 'Create a new user failed.'
            })
            reject(e);
        }
    })
}


let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.username || !data.password || !data.role) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.name = data.name;
                user.gender = data.gender;
                user.role = data.role;
                user.phonenumber = data.phonenumber;
                user.email = data.email;
                user.birthDay = data.birthDay;
                user.userName = data.userName;
                user.password = data.password;
                user.startWork = data.startWork;
                user.address = data.address;
                user.image = data.image;
                user.updatedAt = new Date();
                await user.save()
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user succeeds! '
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found!"
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 1,
                errMessage: "The user doesn't exist"
            })
        }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete user success.'
        })
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
}