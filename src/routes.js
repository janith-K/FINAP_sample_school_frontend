import React from "react";

/*-- Import required components --*/
const Students = React.lazy(() =>
  import("./components/pages/students/Students")
);
const Classroom = React.lazy(() =>
  import("./components/pages/classroom/Classroom")
);
const Teacher = React.lazy(() =>
  import("./components/pages/teachers/Teachers")
);
const Subject = React.lazy(() =>
  import("./components/pages/subjects/Subjects")
);
const AllocateSubjects = React.lazy(() =>
  import("./components/pages/allocateSubjects/AllocateSubjects")
);
const AllocateClassrooms = React.lazy(() =>
  import("./components/pages/allocateClassrooms/AllocateClassrooms")
);
const Report = React.lazy(() => import("./components/pages/report/Report"));
const routes = [
  {
    path: "/students",
    name: "Students",
    icon: "fa fa-star",
    component: Students,
  },
  {
    path: "/classroom",
    name: "Classroom",
    icon: "fa fa-star",
    component: Classroom,
  },
  {
    path: "/teachers",
    name: "Teacher",
    icon: "fa fa-star",
    component: Teacher,
  },
  {
    path: "/subjects",
    name: "Subject",
    icon: "fa fa-star",
    component: Subject,
  },
  {
    path: "/subjectAllocation",
    name: "Subject Allocation",
    icon: "fa fa-book",
    component: AllocateSubjects,
  },
  {
    path: "/classroomAllocation",
    name: "Classroom Allocation",
    icon: "fa fa-book",
    component: AllocateClassrooms,
  },
  {
    path: "/report",
    name: "Report",
    icon: "fa fa-book",
    component: Report,
  },
];
export default routes;
