export default class EmployeeDto {
  constructor({ name, surnames, email, phone, managers }) {
    this.name = name;
    this.surnames = surnames;
    this.email = email;
    this.phone = phone;
    this.managers = managers;
  }
}
