export default class BasicEmployeeEntity {
  constructor({ name, surnames, email, phone, username, address }) {
    this.name = name;
    this.surnames = surnames;
    this.email = email;
    this.phone = phone;
    this.username = username;
    this.address = address;
  }
}
