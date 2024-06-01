import { validationResult } from "express-validator";
import { APP_STATUS } from "../constants/constants";
import { Router, Request, Response } from "express";
import ContactTable from "../database/ContactSchema";
import { IContact } from "../model/IContact";
import mongoose from "mongoose";

/*
 @usage : to get all contacts 
 @method : GET
 @params : no-params
 @url : http://localhost:9999/contacts
*/

export const getAllContacts = async (request: Request, response: Response) => {
  try {
    let contacts: IContact[] | undefined = await ContactTable.find(); //select * from table
    if (contacts) {
      return response.status(200).json({
        status: APP_STATUS.SUCCESS,
        data: contacts,
        msg: "",
      });
    }
  } catch (error: any) {
    return response.status(500).json({
      status: APP_STATUS.FAILED,
      data: null,
      error: error.message,
    });
  }
};

/**
@usage : get a contact
@method : GET
@params : no-params
@url : http://localhost:9999/contacts/:contactId
 */

export const getContact = async (request: Request, response: Response) => {
  try {
    let { contactId } = request.params;
    const mongoContactId = new mongoose.Types.ObjectId(contactId); //sting->mongo Id
    const contact: IContact | undefined | null = await ContactTable.findById(
      mongoContactId
    );
    if (!contact) {
      return response.status(404).json({
        status: APP_STATUS.FAILED,
        data: null,
        msg: "No Contact Found",
      });
    }
    return response.status(200).json({
      status: APP_STATUS.SUCCESS,
      data: contact,
      msg: " ",
    });
  } catch (error: any) {
    return response.status(500).json({
      status: APP_STATUS.FAILED,
      data: null,
      error: error.message,
    });
  }
};

/**
@usage : create a contact 
@method : POST 
@params : name,imageUrl, email, mobile, company, title, groupId
@url : http://localhost:9999/contacts/
 */

export const createContact = async (request: Request, response: Response) => {
  const error = validationResult(request);
  if (!error.isEmpty()) {
    return response.status(400).json({ error: error.array() });
  }
  try {
    //read the form data
    let { name, imageUrl, email, mobile, company, title, groupId } =
      request.body;

    //check if the mobile number is exists
    let contact = await ContactTable.findOne({ mobile: mobile });
    if (contact) {
      return response.status(500).json({
        status: APP_STATUS.FAILED,
        data: null,
        error: "mobile number is already exists",
      });
    }

    //create a contact
    let theContactObj: IContact = {
      name: name,
      imageUrl: imageUrl,
      email: email,
      mobile: mobile,
      title: title,
      company: company,
      groupId: groupId,
    };
    theContactObj = await new ContactTable(theContactObj).save();
    //send a contact
    if (theContactObj) {
      return response.status(200).json({
        status: APP_STATUS.SUCCESS,
        data: theContactObj,
        msg: "Contact is created",
      });
    }
  } catch (error: any) {
    return response.status(500).json({
      status: APP_STATUS.FAILED,
      data: null,
      error: error.message,
    });
  }
};
/**
@usage: update a contact 
@method : PUT
@params :  name,imageUrl, email, mobile, company, title, groupId
@url : http://localhost: 9000/contacts/: contactId
 */
export const updateContact = async (request: Request, response: Response) => {
    const {contactId}=request.params
    const error = validationResult(request);
    if (!error.isEmpty()) {
      return response.status(400).json({ error: error.array() });
    }
  try {
    //read the form data
    let { name, imageUrl, email, mobile, company, title, groupId } =
      request.body;

      //check if the contact is exists
      const mongoContactId=new mongoose.Types.ObjectId(contactId)
    let contact :IContact|null|undefined = await ContactTable.findById(mongoContactId);
    if (!contact) {
      return response.status(404).json({
        status: APP_STATUS.FAILED,
        data: null,
        error: "contact is not found",
      });
    }

    //update  a contact
    let theContactObj: IContact | null= {
      name: name,
      imageUrl: imageUrl,
      email: email,
      mobile: mobile,
      title: title,
      company: company,
      groupId: groupId,
    };
      theContactObj = await ContactTable.findByIdAndUpdate(mongoContactId, {
        $set:theContactObj
    },{new:true})//return update record
    //send a contact
    if (theContactObj) {
      return response.status(200).json({
        status: APP_STATUS.SUCCESS,
        data: theContactObj,
        msg: "Contact is updated",
      });
    }
  } catch (error: any) {
    return response.status(500).json({
      status: APP_STATUS.FAILED,
      data: null,
      error: error.message,
    });
  }
};

/**
@usage: Delete a contact 
@method : DELETE
@params : no-params
@url : http://localhost:9999/contacts/: contactId
 */

export const deleteContact = async (request: Request, response: Response) => {
    try {
        let { contactId } = request.params;
        const mongoContactId = new mongoose.Types.ObjectId(contactId); //sting->mongo Id
        const contact: IContact | undefined | null = await ContactTable.findById(
          mongoContactId
        );
        if (!contact) {
          return response.status(404).json({
            status: APP_STATUS.FAILED,
            data: null,
            msg: "No Contact Found",
          });
        }
        let theContact: IContact | null = await ContactTable.findByIdAndDelete(mongoContactId)
        if (theContact) {
            return response.status(200).json({
                status: APP_STATUS.SUCCESS,
                data: theContact,
                msg: "contact is deleted ",
              });
        }
        return response.status(200).json({
          status: APP_STATUS.SUCCESS,
          data: contact,
          msg: " ",
        });
  } catch (error: any) {
    return response.status(500).json({
      status: APP_STATUS.FAILED,
      data: null,
      error: error.message,
    });
  }
};
