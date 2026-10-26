const module1 = require("./chapters/module1");
const module2 = require("./chapters/module2");
const module3 = require("./chapters/module3");
const module4 = require("./chapters/module4");
const { hashPassword } = require("../config/hash");

const courseData = {
  code: "ITEP413-T",
  title: "Cloud Computing (Elective 4)",
  term: "1st Term",
  year_level: "4th Year (4-1)",
  description: "IT Professional Elective 4 course on Cloud Computing covering architectural basics, core technologies, enterprise security, operations, and emerging hyperscale paradigms."
};

const chapters = [
  ...module1,
  ...module2,
  ...module3,
  ...module4
];

const defaultUsers = [
  {
    username: "faculty",
    password_hash: hashPassword("faculty123"),
    first_name: "Alan",
    surname: "Turing",
    role: "faculty",
    is_active: 1
  },
  {
    username: "student1",
    password_hash: hashPassword("student123"),
    first_name: "Juan",
    surname: "Dela Cruz",
    role: "student",
    is_active: 1
  },
  {
    username: "student2",
    password_hash: hashPassword("student123"),
    first_name: "Maria",
    surname: "Santos",
    role: "student",
    is_active: 1
  },
  {
    username: "student3",
    password_hash: hashPassword("student123"),
    first_name: "Carlo",
    surname: "Reyes",
    role: "student",
    is_active: 1
  },
  {
    username: "student4",
    password_hash: hashPassword("student123"),
    first_name: "Ana",
    surname: "Gomez",
    role: "student",
    is_active: 1
  }
];

module.exports = {
  courseData,
  chapters,
  defaultUsers
};

