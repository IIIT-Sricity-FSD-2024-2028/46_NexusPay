"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDisputeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_dispute_dto_1 = require("./create-dispute.dto");
class UpdateDisputeDto extends (0, swagger_1.PartialType)(create_dispute_dto_1.CreateDisputeDto) {
}
exports.UpdateDisputeDto = UpdateDisputeDto;
//# sourceMappingURL=update-dispute.dto.js.map