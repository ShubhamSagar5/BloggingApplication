import mongoose from "mongoose";



const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength:[8,"Title At Least Contain 8 Character "],
        maxLength:[40,"Title Not Exceeding More Than 40 Character"]
    },
    mainImage:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    intro:{
        type:String,
        required:true,
        minLength:[250,"Into At Least Contain 250 Character "],
       
    },
    paraOneImage:{
        public_id:{
            type:String,
            
        },
        url:{
            type:String
        }
    },
    paraOneDescription:{
        type:String,
        minLength:[50,"ParaOne Description At Least Contain 50 Character "],
    },
    paraOneTitle:{
        type:String,
        minLength:[50,"ParaOne Title At Least Contain 50 Character "],
    },
    paraTwoImage:{
        public_id:{
            type:String,
            
        },
        url:{
            type:String
        }
    },
    paraTwoDescription:{
        type:String,
        minLength:[50,"ParaTwo Description At Least Contain 50 Character "],
    },
    paraTwoTitle:{
        type:String,
        minLength:[50,"ParaTwo Title At Least Contain 50 Character "],
    },
    paraThreeImage:{
        public_id:{
            type:String,
            
        },
        url:{
            type:String
        }
    },
    paraThreeDescription:{
        type:String,
        minLength:[50,"ParaThree Description At Least Contain 50 Character "],
    },
    paraThreeTitle:{
        type:String,
        minLength:[50,"ParaThree Title At Least Contain 50 Character "],
    },
    category:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    authorName:{
        type:String,
        required:true
    },
    authorAvatar:{
        type:String,
        required:true
    }
})

export const Blog = mongoose.model("Blog",blogSchema)