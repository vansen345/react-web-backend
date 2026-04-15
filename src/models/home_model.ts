import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
    FO100: { type: Number },
    FO100H: { type: Number },
    FT300: { type: Number },
    PV301: { type: String },
    PV302: { type: String },  
    PN303: { type: Number },
    PV305: { type: String },
    PV307: { type: String },
    PD308: { type: Date },
    PN309: { type: Number },
    PV314: { type: String },
    PV319: { type: String },
    PV325: { type: String },
    PN326: { type: Number },
    PN350: { type: Number },

    // ✅ Mixed cho object phức tạp
    PO322: { type: mongoose.Schema.Types.Mixed },
    PO323: { type: mongoose.Schema.Types.Mixed },

    PA316: [{
        KEY: { type: String },
        KEY_STEM: { type: String },
    }],

    TOTALLIKES: { type: Number, default: 0 },
    TOTALCOMMENTS: { type: Number, default: 0 },
    PP300: { type: Number },
    TYPE: { type: String },
    NV106: { type: String },
    NV126: { type: String },
    NV117: { type: String },
    KV102: { type: String },
    ISLIKED: { type: Number, default: 0 },
    FNC951: { type: Number, default: 0 },
    RN331: { type: Number },
    SPIN: { type: mongoose.Schema.Types.Mixed },
    PL347: { type: Date },
    PL348: { type: Date },

}, { timestamps: true });

export default mongoose.model('Home', homeSchema);