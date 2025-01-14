import { FormGroup } from "@angular/forms";

export class ModalConfig {
  title: string = "";
  description: FormGroup | string = "";
  saveButton?: string = "";
  closeButton: string = "";
  extraButton?: string = "";
  save?: Function = () => {};
  discard?: Function = () => {};
}