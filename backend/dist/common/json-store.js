"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStore = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class JsonStore {
    filePath;
    defaults;
    constructor(filename, defaults) {
        this.defaults = defaults;
        const dataDir = path.join(__dirname, '..', '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        this.filePath = path.join(dataDir, filename);
        if (!fs.existsSync(this.filePath)) {
            this.writeAll(this.defaults);
        }
    }
    readAll() {
        try {
            const raw = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch {
            this.writeAll(this.defaults);
            return [...this.defaults];
        }
    }
    writeAll(data) {
        const tmpPath = this.filePath + '.tmp';
        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
        fs.renameSync(tmpPath, this.filePath);
    }
    getNextId(prefix, idField = 'id', padLength = 3) {
        const data = this.readAll();
        let maxNum = 0;
        for (const item of data) {
            const id = item[idField];
            if (typeof id === 'string' && id.startsWith(prefix)) {
                const numPart = parseInt(id.slice(prefix.length), 10);
                if (!isNaN(numPart) && numPart > maxNum) {
                    maxNum = numPart;
                }
            }
        }
        return `${prefix}${String(maxNum + 1).padStart(padLength, '0')}`;
    }
    getNextNumericId(idField = 'id') {
        const data = this.readAll();
        let maxId = 0;
        for (const item of data) {
            const id = item[idField];
            if (typeof id === 'number' && id > maxId) {
                maxId = id;
            }
        }
        return maxId + 1;
    }
}
exports.JsonStore = JsonStore;
//# sourceMappingURL=json-store.js.map