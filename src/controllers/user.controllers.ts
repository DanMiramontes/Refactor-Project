import { Request, Response } from "express";
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as CryptoJS from "crypto-js";
import config from "../config";

export async function createUser(req: Request, res: Response) {
    const {firstname, lastname, password, role, email} = req.body;

    let hasheadPassword = '';
    hasheadPassword = bcrypt.hashSync(password,8);
    const user = new User();
    user.firstName = firstname;
    user.email = email;
    user.lastName = lastname;
    user.password = hasheadPassword;
    user.role = role;
    await user.save();
    res.status(201).send('User created'); 
}

export async function sigininUser(req: Request, res: Response) {

    const {email, password} = req.body;
    
    if(!(email && password)){
       return res.status(400).json({error: 'email or password is required'});    
    }
    const user = await User.find({
        select: {
            id: true,
            firstName: true,
            email: true,
            password: true
        },
        relations: {
            role: true
        },
        where:{
            email: email
        },   
    });



    const passwordCorrect = user.length === 0 ? false : await bcrypt.compare(password, user[0].password);
    if(!(user && passwordCorrect)){
        return res.status(401).json({error: 'invalid user or password'});
    } 
    const payload = {
        sub: user[0].id,
        name: user[0].firstName,
        role: user[0].role.role,
        iat: moment().unix(),
        exp: moment().add(7, 'day').unix(),
    }
    const token = jwt.sign(payload,config.SECRET);
    res.status(200).send({user: user[0].firstName, access_token: token});
}

export interface CustomRequest extends Request {
    token: JwtPayload |string | number;
   }
export async function verifyUser(req: Request, res: Response) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
          throw new Error();
        }
        const decoded = jwt.verify(token, config.SECRET);
        const id = decoded.sub 
        const user = await User.find({
            select: {
                id: true,
                firstName: true,
                lastName:true,
            },
            relations: {
                role: true
            },
            where:{
                id : id
            },   
        });

        if(!user){
            return res.status(400).json({error: "failer",message:"User not found"});
        }
        const response = {
            id: user[0].id,
            name: user[0].firstName,
            lastname: user[0].lastName,
            role: {
                name: user[0].role.role,
            }
        }

        const message = await set(JSON.stringify(response));
        console.log(message);
        
       res.status(200).send({status:"ok",data:message});

    } catch (err) {
        res.status(401).send('Please authenticate');
    }
}

async function set(value:string) {
    const keys = config.KEY;
    const key = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const encrypted = CryptoJS.DES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return encrypted.toString();
  }


