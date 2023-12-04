"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const learnerRouter_1 = __importDefault(require("./Routes/learnerRouter"));
const cors_1 = __importDefault(require("cors"));
const matutorRouter = (0, express_1.default)();
const port = 3000;
matutorRouter.use((0, cors_1.default)());
matutorRouter.use(express_1.default.json());
matutorRouter.use("/learner", learnerRouter_1.default);
matutorRouter.listen(port, () => {
    try {
        console.log(`Server is running on port ${port}`);
    }
    catch (exception) {
        console.error(exception);
    }
});
