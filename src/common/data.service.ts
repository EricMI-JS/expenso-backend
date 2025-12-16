import { Injectable } from '@nestjs/common';
// DataService retained for backward-compatibility but unused when using DB.
@Injectable()
export class DataService {
  genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
}
