import { validationResult } from "express-validator";
import { APP_STATUS } from "../constants/constants";
import { Router, Request, Response } from "express";
import GroupTable from "../database/GroupSchema";
import { IGroups } from "../model/IGroups";
import mongoose from "mongoose";

/*
 @usage : create a group 
 @method : POST
 @params : name
 @url : http://localhost:9999/groups
*/

export const createGroup = async (request: Request, response: Response) => {
    const error = validationResult(request);
    if (!error.isEmpty()) {
      return response.status(400).json({ error: error.array() });
    }
    try {
        let { name } = request.body

        //check if the name is already existed
        let group: IGroups | null | undefined = await GroupTable.findOne({ name: name })
        if (group) {
            return response.status(400).json({
                status: APP_STATUS.FAILED,
                data: null,
                msg:"Name is already Existed"
            })
        }

        let theGroup: IGroups|null| undefined = await new GroupTable({ name: name }).save()
        if (theGroup) {
            return response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: theGroup,
                msg:"Group is created"
            })
        }
    } catch(error:any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error:error.message
        })
    }
}

/*
 @usage : to get all groups 
 @method : GET
 @params : no-params
 @url : http://localhost:9999/groups
*/

export const getAllGroups= async (request: Request, response: Response) => {
    try {
        let groups: IGroups[] | undefined = await GroupTable.find();
        if (groups) {
            return response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: groups,
                error:" "
            })
        }
    } catch(error:any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error:error.message
        })
    }
}



/*
 @usage : to get group
 @method : GET
 @params : no-params
 @url : http://localhost:9000/groups/:groupId
*/

export const getGroup= async (request: Request, response: Response) => {
    try {
        let { groupId } = request.params
        const mongoGroupId = new mongoose.Types.ObjectId(groupId)
        let theGroup: IGroups | undefined | null = await GroupTable.findById(mongoGroupId)
        if (!theGroup) {
            return response.status(404).json({
                status: APP_STATUS.FAILED,
                data: null,
                error:"No Group is Found"
            })
        }return response.status(200).json({
            status: APP_STATUS.SUCCESS,
            data: theGroup,
            error:"  "
        })
    } catch(error:any) {
        return response.status(500).json({
            status: APP_STATUS.FAILED,
            data: null,
            error:error.message
        })
    }
}
