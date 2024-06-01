import mongoose from "mongoose";

import { IGroups } from "../model/IGroups";

const GroupSchema = new mongoose.Schema<IGroups>({
    name: { type: String, required: true, unique:true }
},{timestamps:true})
const GroupTable = mongoose.model<IGroups>('groups', GroupSchema);
export default GroupTable